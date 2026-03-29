from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Callable
from collections import Counter

from app.anilist_client import AniListClient, AniListClientError
from app.calendar_common import DATA_DIR, SOURCE_DATA_FILE, get_env, load_json, save_json
from app.mal_client import MalClient, MalClientError
from app.mal_scraper import extract_character_name_ja, extract_person_name_ja


NAME_MAP_DIR = DATA_DIR / "name_maps"
PEOPLE_MAP_FILE = NAME_MAP_DIR / "people_ja.json"
CHARACTER_MAP_FILE = NAME_MAP_DIR / "characters_ja.json"
ProgressCallback = Callable[[str, str], None]


def ensure_map_dir() -> None:
    NAME_MAP_DIR.mkdir(parents=True, exist_ok=True)


def normalize_person_name(value: str | None) -> str:
    text = str(value or "").strip().lower()
    if "," in text:
        last, first = [part.strip() for part in text.split(",", 1)]
        text = f"{first} {last}".strip()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_character_name(value: str | None) -> str:
    text = str(value or "").strip().lower()
    if "," in text:
        last, first = [part.strip() for part in text.split(",", 1)]
        text = f"{first} {last}".strip()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_loose_name(value: str | None) -> str:
    text = normalize_person_name(value)
    text = re.sub(r"ou\b", "o", text)
    text = re.sub(r"oo\b", "o", text)
    text = re.sub(r"aa\b", "a", text)
    text = re.sub(r"uu\b", "u", text)
    text = re.sub(r"ii\b", "i", text)
    return text


def anime_id_from_entry(entry: dict[str, Any]) -> int | None:
    match = re.search(r"(\d+)$", str(entry.get("id") or ""))
    return int(match.group(1)) if match else None


def build_lookup(edges: list[dict[str, Any]], name_getter) -> dict[str, str]:
    grouped: dict[str, set[str]] = {}
    for edge in edges:
        full_name, native_name = name_getter(edge)
        key = normalize_person_name(full_name)
        native = str(native_name or "").strip()
        if not key or not native:
            continue
        grouped.setdefault(key, set()).add(native)
    return {key: next(iter(values)) for key, values in grouped.items() if len(values) == 1}


def build_character_lookup(edges: list[dict[str, Any]]) -> dict[str, str]:
    grouped: dict[str, set[str]] = {}
    for edge in edges:
        node = edge.get("node") or {}
        name = node.get("name") or {}
        native = str(name.get("native") or "").strip()
        for key in {normalize_character_name(name.get("full")), normalize_loose_name(name.get("full"))}:
            if key and native:
                grouped.setdefault(key, set()).add(native)
    return {key: next(iter(values)) for key, values in grouped.items() if len(values) == 1}


def build_person_lookup(edges: list[dict[str, Any]], name_getter) -> dict[str, str]:
    grouped: dict[str, set[str]] = {}
    for edge in edges:
        full_name, native_name = name_getter(edge)
        native = str(native_name or "").strip()
        for key in {normalize_person_name(full_name), normalize_loose_name(full_name)}:
            if key and native:
                grouped.setdefault(key, set()).add(native)
    return {key: next(iter(values)) for key, values in grouped.items() if len(values) == 1}


def should_enrich_names(existing_entry: dict[str, Any] | None = None) -> bool:
    mode = (get_env("ANIME_ENRICH_JA_NAMES", "missing") or "missing").strip().lower()
    if mode in {"0", "false", "no", "off", "disabled"}:
        return False
    if mode in {"1", "true", "yes", "on", "all"}:
        return True

    credits = ((existing_entry or {}).get("extensions") or {}).get("credits") or {}
    for item in credits.get("characters") or []:
        if not item.get("character_name_ja") or (item.get("voice_actor_name") and not item.get("voice_actor_name_ja")):
            return True
    for item in credits.get("staff") or []:
        if not item.get("name_ja"):
            return True
    return False


def enrich_entry_names(
    entry: dict[str, Any],
    media: dict[str, Any],
    people_map: dict[str, str],
    character_map: dict[str, str],
) -> bool:
    credits = ((entry.get("extensions") or {}).get("credits") or {})
    characters = credits.get("characters") or []
    staff = credits.get("staff") or []
    changed = False

    character_edges = (media.get("characters") or {}).get("edges") or []
    staff_edges = (media.get("staff") or {}).get("edges") or []

    character_lookup = build_character_lookup(character_edges)
    voice_actor_lookup = build_person_lookup(
        [voice_actor for edge in character_edges for voice_actor in edge.get("voiceActors") or []],
        lambda actor: (
            (actor.get("name") or {}).get("full"),
            (actor.get("name") or {}).get("native"),
        ),
    )
    staff_lookup = build_person_lookup(
        staff_edges,
        lambda edge: (
            ((edge.get("node") or {}).get("name") or {}).get("full"),
            ((edge.get("node") or {}).get("name") or {}).get("native"),
        ),
    )

    for item in characters:
        character_id = str(item.get("character_mal_id") or "").strip()
        voice_actor_id = str(item.get("voice_actor_mal_id") or "").strip()

        ja_name = character_map.get(character_id)
        if not ja_name:
            ja_name = character_lookup.get(normalize_character_name(item.get("character_name")))
        if not ja_name:
            ja_name = character_lookup.get(normalize_loose_name(item.get("character_name")))
            if ja_name and character_id:
                character_map[character_id] = ja_name
        if ja_name and item.get("character_name_ja") != ja_name:
            item["character_name_ja"] = ja_name
            changed = True

        va_ja_name = people_map.get(voice_actor_id)
        if not va_ja_name:
            va_ja_name = voice_actor_lookup.get(normalize_person_name(item.get("voice_actor_name")))
        if not va_ja_name:
            va_ja_name = voice_actor_lookup.get(normalize_loose_name(item.get("voice_actor_name")))
            if va_ja_name and voice_actor_id:
                people_map[voice_actor_id] = va_ja_name
        if va_ja_name and item.get("voice_actor_name_ja") != va_ja_name:
            item["voice_actor_name_ja"] = va_ja_name
            changed = True

    for item in staff:
        person_id = str(item.get("person_mal_id") or "").strip()
        ja_name = people_map.get(person_id)
        if not ja_name:
            ja_name = staff_lookup.get(normalize_person_name(item.get("name")))
        if not ja_name:
            ja_name = staff_lookup.get(normalize_loose_name(item.get("name")))
            if ja_name and person_id:
                people_map[person_id] = ja_name
        if ja_name and item.get("name_ja") != ja_name:
            item["name_ja"] = ja_name
            changed = True

    return changed


def apply_cached_names(
    entry: dict[str, Any],
    people_map: dict[str, str],
    character_map: dict[str, str],
) -> bool:
    credits = ((entry.get("extensions") or {}).get("credits") or {})
    characters = credits.get("characters") or []
    staff = credits.get("staff") or []
    changed = False

    for item in characters:
        character_id = str(item.get("character_mal_id") or "").strip()
        voice_actor_id = str(item.get("voice_actor_mal_id") or "").strip()

        ja_name = character_map.get(character_id)
        if ja_name and item.get("character_name_ja") != ja_name:
            item["character_name_ja"] = ja_name
            changed = True

        va_ja_name = people_map.get(voice_actor_id)
        if va_ja_name and item.get("voice_actor_name_ja") != va_ja_name:
            item["voice_actor_name_ja"] = va_ja_name
            changed = True

    for item in staff:
        person_id = str(item.get("person_mal_id") or "").strip()
        ja_name = people_map.get(person_id)
        if ja_name and item.get("name_ja") != ja_name:
            item["name_ja"] = ja_name
            changed = True

    return changed


def enrich_maps_from_mal_pages(
    payload: dict[str, Any],
    people_map: dict[str, str],
    character_map: dict[str, str],
    *,
    year_filter: int | None = None,
) -> bool:
    people_counter: Counter[str] = Counter()
    character_counter: Counter[str] = Counter()

    for entry in payload.get("entries", []):
        if year_filter is not None and int((entry.get("season") or {}).get("year") or 0) != int(year_filter):
            continue
        credits = ((entry.get("extensions") or {}).get("credits") or {})
        for item in credits.get("characters") or []:
            character_id = str(item.get("character_mal_id") or "").strip()
            voice_actor_id = str(item.get("voice_actor_mal_id") or "").strip()
            if character_id and not character_map.get(character_id):
                character_counter[character_id] += 1
            if voice_actor_id and not people_map.get(voice_actor_id):
                people_counter[voice_actor_id] += 1
        for item in credits.get("staff") or []:
            person_id = str(item.get("person_mal_id") or "").strip()
            if person_id and not people_map.get(person_id):
                people_counter[person_id] += 1

    max_people = max(0, int(get_env("ANIME_ENRICH_MAL_PEOPLE_PER_RUN", "120") or "120"))
    max_characters = max(0, int(get_env("ANIME_ENRICH_MAL_CHARACTERS_PER_RUN", "60") or "60"))
    if not people_counter and not character_counter:
        return False

    client = MalClient.from_env()
    changed = False

    for person_id, _ in people_counter.most_common(max_people):
        if not str(person_id).isdigit():
            continue
        try:
            page_html = client.get_person_page_html(int(person_id))
        except MalClientError:
            continue
        ja_name = extract_person_name_ja(page_html)
        if ja_name and people_map.get(person_id) != ja_name:
            people_map[person_id] = ja_name
            changed = True

    for character_id, _ in character_counter.most_common(max_characters):
        if not str(character_id).isdigit():
            continue
        try:
            page_html = client.get_character_page_html(int(character_id))
        except MalClientError:
            continue
        ja_name = extract_character_name_ja(page_html)
        if ja_name and character_map.get(character_id) != ja_name:
            character_map[character_id] = ja_name
            changed = True

    return changed


def enrich_names(
    *,
    year_filter: int | None = None,
    progress_callback: ProgressCallback | None = None,
) -> bool:
    ensure_map_dir()
    payload = load_json(SOURCE_DATA_FILE, {})
    if not payload:
        return False

    people_map = load_json(PEOPLE_MAP_FILE, {})
    character_map = load_json(CHARACTER_MAP_FILE, {})
    changed = False

    try:
        if progress_callback:
            label = f"{year_filter}" if year_filter is not None else "all"
            progress_callback("Enriching Japanese names.", f"Preparing MAL name cache ({label}).")
        if enrich_maps_from_mal_pages(payload, people_map, character_map, year_filter=year_filter):
            changed = True
    except MalClientError:
        pass

    client = AniListClient()
    target_entries = [
        entry for entry in payload.get("entries", [])
        if year_filter is None or int((entry.get("season") or {}).get("year") or 0) == int(year_filter)
    ]

    for index, entry in enumerate(target_entries, start=1):
        if progress_callback and index == 1:
            label = f"{year_filter}" if year_filter is not None else "all"
            progress_callback("Enriching Japanese names.", f"Applying cached/native names ({label}).")
        if apply_cached_names(entry, people_map, character_map):
            changed = True
        if not should_enrich_names(entry):
            continue
        credits = ((entry.get("extensions") or {}).get("credits") or {})
        if not (credits.get("characters") or credits.get("staff")):
            continue
        anime_id = anime_id_from_entry(entry)
        if anime_id is None:
            continue
        if progress_callback:
            progress_callback("Enriching Japanese names.", f"{index}/{len(target_entries)} -> MAL {anime_id}")
        try:
            media = client.get_media_name_bundle(anime_id)
        except AniListClientError:
            continue
        if not media:
            continue
        if enrich_entry_names(entry, media, people_map, character_map):
            changed = True

    if changed:
        save_json(SOURCE_DATA_FILE, payload)
    save_json(PEOPLE_MAP_FILE, people_map)
    save_json(CHARACTER_MAP_FILE, character_map)
    return changed


def main() -> None:
    enrich_names()


if __name__ == "__main__":
    main()
