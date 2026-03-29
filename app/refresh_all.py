from __future__ import annotations

from collections import Counter
from datetime import datetime
from typing import Any, Callable

from app.calendar_common import CHANGE_SUMMARY_FILE, COMPILED_DATA_FILE, SOURCE_DATA_FILE, SOURCE_STATE_FILE, has_mal_client_id, load_json, save_json
from app.enrich_credits import enrich_credits
from app.enrich_external_links import enrich_external_links
from app.enrich_names import enrich_names
from app.fetch_seasons import sync_seasons


ProgressCallback = Callable[[str, str], None]
DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
DAY_LABELS = {
    "MON": "Mon",
    "TUE": "Tue",
    "WED": "Wed",
    "THU": "Thu",
    "FRI": "Fri",
    "SAT": "Sat",
    "SUN": "Sun",
}
SEASON_INDEX = {"WINTER": 1, "SPRING": 2, "SUMMER": 3, "FALL": 4}


def parse_season_ref(value: dict[str, Any] | str | None) -> dict[str, Any] | None:
    if isinstance(value, dict) and value.get("year") and value.get("season"):
        return {"year": int(value["year"]), "quarter": str(value["season"]).upper()}
    if isinstance(value, str) and "-" in value:
        year_text, season_text = value.split("-", 1)
        return {"year": int(year_text), "quarter": season_text.upper()}
    return None


def season_sort_key(value: dict[str, Any] | None) -> tuple[int, int]:
    if not value:
        return (9999, 9)
    return (int(value.get("year") or 9999), SEASON_INDEX.get(str(value.get("quarter") or "").upper(), 9))


def build_collector_status() -> dict[str, Any]:
    state = load_json(SOURCE_STATE_FILE, {})
    completed = [parse_season_ref(item) for item in state.get("completed_seasons", [])]
    completed = [item for item in completed if item]
    oldest_completed = min(completed, key=season_sort_key) if completed else None
    repaired_years = sorted([
        int(item) for item in (state.get("repaired_metadata_years") or [])
        if str(item).isdigit()
    ])
    source_payload = load_json(SOURCE_DATA_FILE, {})
    dataset_meta = source_payload.get("dataset", {}) if isinstance(source_payload, dict) else {}

    return {
        "last_live_sync_at": state.get("last_successful_sync_at"),
        "oldest_completed_season": oldest_completed,
        "next_backfill": parse_season_ref(state.get("next_backfill")),
        "last_link_refresh_at": dataset_meta.get("last_link_refresh_at"),
        "repaired_metadata_years": repaired_years,
        "last_metadata_repair_year": state.get("last_metadata_repair_year"),
        "last_metadata_repair_at": state.get("last_metadata_repair_at"),
    }


def build_credit_indexes(entries: list[dict[str, Any]]) -> dict[str, Any]:
    people_index: dict[str, dict[str, Any]] = {}
    character_index: dict[str, dict[str, Any]] = {}

    for entry in entries:
        entry_id = entry.get("id")
        credits = ((entry.get("extensions") or {}).get("credits") or {})

        for item in credits.get("characters") or []:
            character_id = str(item.get("character_mal_id") or "").strip()
            if character_id:
                character_record = character_index.setdefault(
                    character_id,
                    {
                        "id": character_id,
                        "name": item.get("character_name") or "",
                        "name_ja": item.get("character_name_ja") or "",
                        "entry_ids": [],
                        "voice_actor_ids": [],
                    },
                )
                if item.get("character_name_ja") and not character_record.get("name_ja"):
                    character_record["name_ja"] = item.get("character_name_ja")
                if entry_id and entry_id not in character_record["entry_ids"]:
                    character_record["entry_ids"].append(entry_id)
                voice_actor_id = str(item.get("voice_actor_mal_id") or "").strip()
                if voice_actor_id and voice_actor_id not in character_record["voice_actor_ids"]:
                    character_record["voice_actor_ids"].append(voice_actor_id)

            voice_actor_id = str(item.get("voice_actor_mal_id") or "").strip()
            if voice_actor_id:
                person_record = people_index.setdefault(
                    voice_actor_id,
                    {
                        "id": voice_actor_id,
                        "name": item.get("voice_actor_name") or "",
                        "name_ja": item.get("voice_actor_name_ja") or "",
                        "roles": [],
                        "entry_ids": [],
                    },
                )
                if item.get("voice_actor_name_ja") and not person_record.get("name_ja"):
                    person_record["name_ja"] = item.get("voice_actor_name_ja")
                if entry_id and entry_id not in person_record["entry_ids"]:
                    person_record["entry_ids"].append(entry_id)
                role_item = {
                    "kind": "voice_actor",
                    "entry_id": entry_id,
                    "character_id": character_id,
                    "character_name": item.get("character_name") or "",
                    "character_name_ja": item.get("character_name_ja") or "",
                }
                if role_item not in person_record["roles"]:
                    person_record["roles"].append(role_item)

        for item in credits.get("staff") or []:
            person_id = str(item.get("person_mal_id") or "").strip()
            if not person_id:
                continue
            person_record = people_index.setdefault(
                person_id,
                {
                    "id": person_id,
                    "name": item.get("name") or "",
                    "name_ja": item.get("name_ja") or "",
                    "roles": [],
                    "entry_ids": [],
                },
            )
            if item.get("name_ja") and not person_record.get("name_ja"):
                person_record["name_ja"] = item.get("name_ja")
            if entry_id and entry_id not in person_record["entry_ids"]:
                person_record["entry_ids"].append(entry_id)
            role_item = {
                "kind": "staff",
                "entry_id": entry_id,
                "role": item.get("role") or "",
            }
            if role_item not in person_record["roles"]:
                person_record["roles"].append(role_item)

    people = sorted(people_index.values(), key=lambda item: (-len(item["entry_ids"]), item.get("name_ja") or item.get("name") or item["id"]))
    characters = sorted(character_index.values(), key=lambda item: (-len(item["entry_ids"]), item.get("name_ja") or item.get("name") or item["id"]))
    return {
        "people": people,
        "characters": characters,
        "summary": {
            "people_count": len(people),
            "character_count": len(characters),
        },
    }


def time_sort_value(raw_value: str) -> int:
    text = str(raw_value or "99:99")
    hour_text, minute_text = text.split(":", 1)
    return int(hour_text) * 60 + int(minute_text)


def build_search_text(entry: dict[str, Any]) -> str:
    titles = entry.get("titles", {})
    broadcasters = entry.get("broadcasters", {})
    extensions = entry.get("extensions", {})
    credits = extensions.get("credits", {})
    cast_names = [item.get("character_name", "") for item in credits.get("characters", [])]
    cast_names.extend(item.get("character_name_ja", "") for item in credits.get("characters", []))
    cast_names.extend(item.get("voice_actor_name", "") for item in credits.get("characters", []))
    cast_names.extend(item.get("voice_actor_name_ja", "") for item in credits.get("characters", []))
    staff_names = [item.get("name", "") for item in credits.get("staff", [])]
    staff_names.extend(item.get("name_ja", "") for item in credits.get("staff", []))

    parts = [
        entry.get("id", ""),
        titles.get("ja", ""),
        titles.get("en", ""),
        titles.get("ko", ""),
        titles.get("short", ""),
        broadcasters.get("network", ""),
        broadcasters.get("block", ""),
        extensions.get("media_type", ""),
        extensions.get("source_material", ""),
        " ".join(extensions.get("studios", [])),
        str((entry.get("season") or {}).get("year", "")),
        str((entry.get("season") or {}).get("quarter", "")),
        " ".join(entry.get("tags", [])),
        " ".join(entry.get("notes", [])),
        " ".join(cast_names),
        " ".join(staff_names),
    ]
    return " ".join(str(part).strip() for part in parts if str(part).strip()).lower()


def normalize_entry(raw_entry: dict[str, Any]) -> dict[str, Any]:
    schedule = raw_entry["schedule"]
    weekday = schedule["day_of_week"]
    availability = raw_entry.get("availability") or {}

    return {
        **raw_entry,
        "favorite_key": raw_entry["id"],
        "weekday_index": DAY_ORDER.index(weekday),
        "weekday_label_ko": DAY_LABELS[weekday],
        "time_sort_value": time_sort_value(schedule["time"]),
        "search_text": build_search_text(raw_entry),
        "kr_streaming_label": "confirmed" if availability.get("kr_streaming") is True else "unknown",
        "has_kr_streaming": availability.get("kr_streaming") is True,
    }


def important_snapshot(entry: dict[str, Any]) -> dict[str, Any]:
    schedule = entry.get("schedule", {})
    titles = entry.get("titles", {})
    source_links = entry.get("source_links", {})
    return {
        "id": entry.get("id", ""),
        "status": entry.get("status", ""),
        "ja": titles.get("ja", ""),
        "en": titles.get("en", ""),
        "day_of_week": schedule.get("day_of_week", ""),
        "date": schedule.get("date", ""),
        "time": schedule.get("time", ""),
        "sort_at": schedule.get("sort_at", ""),
        "official": source_links.get("official", ""),
    }


def build_change_summary(previous_entries: list[dict[str, Any]], current_entries: list[dict[str, Any]]) -> dict[str, Any]:
    before_index = {entry["id"]: important_snapshot(entry) for entry in previous_entries}
    after_index = {entry["id"]: important_snapshot(entry) for entry in current_entries}

    added = [after_index[key] for key in sorted(after_index.keys() - before_index.keys())]
    removed = [before_index[key] for key in sorted(before_index.keys() - after_index.keys())]
    changed = []

    for key in sorted(before_index.keys() & after_index.keys()):
        if before_index[key] != after_index[key]:
            changed.append({"before": before_index[key], "after": after_index[key]})

    return {
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "summary": {
            "added": len(added),
            "removed": len(removed),
            "changed": len(changed),
        },
        "added": added,
        "removed": removed,
        "changed": changed,
    }


def compile_payload(source_payload: dict[str, Any]) -> dict[str, Any]:
    raw_entries = source_payload.get("entries", [])
    entries = [normalize_entry(entry) for entry in raw_entries]
    entries.sort(key=lambda item: (item["weekday_index"], item["time_sort_value"], item["titles"]["ja"]))

    weekday_counts = Counter(entry["schedule"]["day_of_week"] for entry in entries)
    indexes = build_credit_indexes(entries)
    return {
        "version": source_payload.get("version", 1),
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "dataset": source_payload.get("dataset", {}),
        "collector_status": build_collector_status(),
        "indexes": indexes,
        "summary": {
            "total_entries": len(entries),
            "weekday_counts": {day: weekday_counts.get(day, 0) for day in DAY_ORDER},
            "people_count": indexes["summary"]["people_count"],
            "character_count": indexes["summary"]["character_count"],
        },
        "entries": entries,
    }


def main(
    progress_callback: ProgressCallback | None = None,
    *,
    include_forward: bool = True,
    backfill_per_run_override: int | None = None,
    link_refresh_limit_override: int | None = None,
    refresh_external_links: bool = True,
    enrich_japanese_names: bool = True,
) -> None:
    if not has_mal_client_id():
        raise RuntimeError("MAL_CLIENT_ID is missing. Add your own MAL Client ID to .env before running DB updates.")

    if progress_callback:
        progress_callback("Syncing MAL seasons.", "The collector updates source JSON before building web data.")
    sync_seasons(
        progress_callback=progress_callback,
        include_forward=include_forward,
        backfill_per_run_override=backfill_per_run_override,
    )

    if refresh_external_links:
        if progress_callback:
            progress_callback("Refreshing official links.", "Missing official pages and X links are being rechecked from MAL HTML.")
        enrich_external_links(limit=link_refresh_limit_override, progress_callback=progress_callback)

    if progress_callback:
        progress_callback("Enriching missing credits.", "AniList is filling cast and staff for titles whose credits are still empty.")
    enrich_credits(progress_callback=progress_callback)

    if enrich_japanese_names:
        if progress_callback:
            progress_callback("Enriching Japanese names.", "AniList native names are being merged into cached cast and staff data.")
        enrich_names()

    if progress_callback:
        progress_callback("Loading source data.", "The normalized source JSON is being prepared for the web app.")
    source_payload = load_json(SOURCE_DATA_FILE, {})
    previous_payload = load_json(COMPILED_DATA_FILE, {"entries": []})

    if progress_callback:
        progress_callback("Building compiled data.", "Weekday order, search text, and derived fields are being refreshed.")
    compiled_payload = compile_payload(source_payload)

    if progress_callback:
        progress_callback("Saving build artifacts.", "Compiled JSON and change summary are being written.")
    save_json(COMPILED_DATA_FILE, compiled_payload)
    save_json(CHANGE_SUMMARY_FILE, build_change_summary(previous_payload.get("entries", []), compiled_payload["entries"]))

    if progress_callback:
        progress_callback("Update complete.", "The animation schedule is ready for the web viewer.")


if __name__ == "__main__":
    main()
