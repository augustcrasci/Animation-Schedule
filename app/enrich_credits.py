from __future__ import annotations

import re
from typing import Any, Callable

from app.anilist_client import AniListClient, AniListClientError
from app.calendar_common import SOURCE_DATA_FILE, get_env, load_json, save_json


ProgressCallback = Callable[[str, str], None]
SEASON_INDEX = {"WINTER": 1, "SPRING": 2, "SUMMER": 3, "FALL": 4}


def anime_id_from_entry(entry: dict[str, Any]) -> int | None:
    match = re.search(r"(\d+)$", str(entry.get("id") or ""))
    return int(match.group(1)) if match else None


def existing_credits(entry: dict[str, Any] | None) -> dict[str, list[dict[str, Any]]]:
    credits = ((entry or {}).get("extensions") or {}).get("credits") or {}
    return {
        "characters": list(credits.get("characters") or []),
        "staff": list(credits.get("staff") or []),
    }


def should_enrich_credits(existing_entry: dict[str, Any] | None = None) -> bool:
    mode = (get_env("ANIME_ENRICH_CREDITS", "missing") or "missing").strip().lower()
    if mode in {"0", "false", "no", "off", "disabled"}:
        return False
    if mode in {"1", "true", "yes", "on", "all"}:
        return True

    credits = existing_credits(existing_entry)
    return not credits["characters"] or not credits["staff"]


def normalize_character_role(value: str | None) -> str:
    text = str(value or "").strip().replace("_", " ").lower()
    return text.title() if text else ""


def candidate_sort_key(entry: dict[str, Any]) -> tuple[int, int, int, int, str]:
    extensions = (entry.get("extensions") or {})
    season = entry.get("season") or {}
    media_type = str(extensions.get("media_type") or "").lower()
    media_rank = {"tv": 0, "ona": 1, "ova": 2, "movie": 3}.get(media_type, 4)
    popularity = extensions.get("popularity")
    popularity_rank = int(popularity) if isinstance(popularity, (int, float)) else 999999
    year_rank = -int(season.get("year") or 0)
    quarter_rank = -SEASON_INDEX.get(str(season.get("quarter") or "").upper(), 0)
    return (media_rank, popularity_rank, year_rank, quarter_rank, str(entry.get("id") or ""))


def extract_anilist_characters(media: dict[str, Any]) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()

    for edge in ((media.get("characters") or {}).get("edges") or []):
        node = edge.get("node") or {}
        name = node.get("name") or {}
        voice_actor = ((edge.get("voiceActors") or [None])[0]) or {}
        voice_name = voice_actor.get("name") or {}

        item = {
            "character_mal_id": str(node.get("idMal") or (f"ani-character-{node.get('id')}" if node.get("id") else "")),
            "character_name": str(name.get("full") or "").strip(),
            "character_name_ja": str(name.get("native") or "").strip(),
            "character_role": normalize_character_role(edge.get("role")),
            "voice_actor_mal_id": str(voice_actor.get("idMal") or (f"ani-person-{voice_actor.get('id')}" if voice_actor.get("id") else "")),
            "voice_actor_name": str(voice_name.get("full") or "").strip(),
            "voice_actor_name_ja": str(voice_name.get("native") or "").strip(),
            "language": "Japanese" if voice_actor else "",
        }
        dedupe_key = (
            item["character_mal_id"] or item["character_name"],
            item["voice_actor_mal_id"] or item["voice_actor_name"],
            item["character_role"],
        )
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)
        if item["character_name"] or item["voice_actor_name"]:
            results.append(item)

    return results


def extract_anilist_staff(media: dict[str, Any]) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()

    for edge in ((media.get("staff") or {}).get("edges") or []):
        node = edge.get("node") or {}
        name = node.get("name") or {}
        item = {
            "person_mal_id": str(node.get("idMal") or (f"ani-person-{node.get('id')}" if node.get("id") else "")),
            "name": str(name.get("full") or "").strip(),
            "name_ja": str(name.get("native") or "").strip(),
            "role": str(edge.get("role") or "").strip(),
        }
        dedupe_key = (item["person_mal_id"] or item["name"], item["role"])
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)
        if item["name"] or item["role"]:
            results.append(item)

    return results


def enrich_credits(
    *,
    progress_callback: ProgressCallback | None = None,
    limit_override: int | None = None,
    year_filter: int | None = None,
) -> bool:
    payload = load_json(SOURCE_DATA_FILE, {})
    if not payload:
        return False

    limit = limit_override
    if limit is None:
        limit = max(0, int(get_env("ANIME_ENRICH_CREDITS_PER_RUN", "240") or "240"))

    candidates = sorted(
        [
            entry for entry in payload.get("entries", [])
            if should_enrich_credits(entry) and (year_filter is None or int((entry.get("season") or {}).get("year") or 0) == int(year_filter))
        ],
        key=candidate_sort_key,
    )
    if limit:
        candidates = candidates[:limit]
    if not candidates:
        return False

    client = AniListClient()
    changed = False

    for index, entry in enumerate(candidates, start=1):
        anime_id = anime_id_from_entry(entry)
        if anime_id is None:
            continue
        if progress_callback:
            progress_callback("Enriching missing credits.", f"{index}/{len(candidates)} -> MAL {anime_id}")
        try:
            media = client.get_media_name_bundle(anime_id)
        except AniListClientError:
            continue
        if not media:
            continue

        credits = ((entry.get("extensions") or {}).get("credits") or {})
        current_characters = list(credits.get("characters") or [])
        current_staff = list(credits.get("staff") or [])

        if not current_characters:
            enriched_characters = extract_anilist_characters(media)
            if enriched_characters:
                credits["characters"] = enriched_characters
                changed = True

        if not current_staff:
            enriched_staff = extract_anilist_staff(media)
            if enriched_staff:
                credits["staff"] = enriched_staff
                changed = True

        entry.setdefault("extensions", {})["credits"] = credits

    if changed:
        save_json(SOURCE_DATA_FILE, payload)
    return changed


def main() -> None:
    enrich_credits()


if __name__ == "__main__":
    main()
