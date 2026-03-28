from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from datetime import date, datetime, time
from typing import Any, Callable

from app.calendar_common import OVERRIDES_FILE, SOURCE_DATA_FILE, SOURCE_STATE_FILE, get_env, load_json, save_json
from app.mal_client import MalClient, MalClientError
from app.mal_scraper import (
    extract_characters,
    extract_external_links,
    extract_staff,
    extract_titles_from_page,
    normalize_official_link,
    normalize_x_link,
)


ProgressCallback = Callable[[str, str], None]
SEASONS = ["winter", "spring", "summer", "fall"]
SEASON_MONTH = {"winter": 1, "spring": 4, "summer": 7, "fall": 10}
MEDIA_TYPE_ALLOWLIST = {"tv", "movie", "ova", "ona"}
DAY_NAME_TO_CODE = {
    "monday": "MON",
    "tuesday": "TUE",
    "wednesday": "WED",
    "thursday": "THU",
    "friday": "FRI",
    "saturday": "SAT",
    "sunday": "SUN",
    "unknown": "SUN",
    "other": "SUN",
}


@dataclass(frozen=True, slots=True)
class SeasonRef:
    year: int
    season: str

    @property
    def key(self) -> str:
        return f"{self.year}-{self.season}"


def normalize_season_name(value: str) -> str:
    lowered = str(value or "").strip().lower()
    if lowered not in SEASONS:
        raise ValueError(f"Unsupported season: {value}")
    return lowered


def next_season(ref: SeasonRef) -> SeasonRef:
    index = SEASONS.index(ref.season)
    if index == len(SEASONS) - 1:
        return SeasonRef(ref.year + 1, SEASONS[0])
    return SeasonRef(ref.year, SEASONS[index + 1])


def previous_season(ref: SeasonRef) -> SeasonRef:
    index = SEASONS.index(ref.season)
    if index == 0:
        return SeasonRef(ref.year - 1, SEASONS[-1])
    return SeasonRef(ref.year, SEASONS[index - 1])


def season_cmp(left: SeasonRef, right: SeasonRef) -> int:
    left_index = (left.year, SEASONS.index(left.season))
    right_index = (right.year, SEASONS.index(right.season))
    return (left_index > right_index) - (left_index < right_index)


def current_season(today: date | None = None) -> SeasonRef:
    if today is None:
        env_today = get_env("ANIME_SYNC_TODAY")
        today = date.fromisoformat(env_today) if env_today else date.today()
    month = today.month
    if month <= 3:
        return SeasonRef(today.year, "winter")
    if month <= 6:
        return SeasonRef(today.year, "spring")
    if month <= 9:
        return SeasonRef(today.year, "summer")
    return SeasonRef(today.year, "fall")


def season_for_month(month: int) -> str:
    if month <= 3:
        return "winter"
    if month <= 6:
        return "spring"
    if month <= 9:
        return "summer"
    return "fall"


def state_or_default() -> dict[str, Any]:
    seed_year = int(get_env("ANIME_SYNC_START_YEAR", "2026") or "2026")
    seed_season = normalize_season_name(get_env("ANIME_SYNC_START_SEASON", "spring") or "spring")
    state = load_json(SOURCE_STATE_FILE, {})
    if state:
        return state
    return {
        "schema_version": 1,
        "seed": {"year": seed_year, "season": seed_season},
        "latest_forward": None,
        "next_backfill": None,
        "completed_seasons": [],
        "last_successful_sync_at": None,
    }


def season_from_dict(value: dict[str, Any] | None, fallback: SeasonRef) -> SeasonRef:
    if not value:
        return fallback
    return SeasonRef(int(value["year"]), normalize_season_name(value["season"]))


def infer_node_season(detail: dict[str, Any], fallback: SeasonRef | None = None) -> SeasonRef | None:
    start_season = detail.get("start_season") or {}
    start_year = start_season.get("year")
    start_name = start_season.get("season")
    if start_year and start_name:
        try:
            return SeasonRef(int(start_year), normalize_season_name(str(start_name)))
        except ValueError:
            pass

    start_date_text = str(detail.get("start_date") or "").strip()
    if start_date_text:
        parts = start_date_text.split("-")
        if len(parts) >= 2 and parts[0] and parts[1]:
            return SeasonRef(int(parts[0]), season_for_month(int(parts[1])))

    return fallback


def matches_target_season(detail: dict[str, Any], ref: SeasonRef, *, strict: bool = False) -> bool:
    actual = infer_node_season(detail, None if strict else ref)
    if actual is None:
        return not strict
    return actual.year == ref.year and actual.season == ref.season


def infer_schedule(detail: dict[str, Any], ref: SeasonRef) -> dict[str, str | None]:
    start_date_text = detail.get("start_date")
    if start_date_text:
        start_date = parse_partial_date(start_date_text, ref)
    else:
        start_date = date(ref.year, SEASON_MONTH[ref.season], 1)

    broadcast = detail.get("broadcast") or {}
    day_name = str(broadcast.get("day_of_the_week") or "").strip().lower()
    time_text = str(broadcast.get("start_time") or "99:99").strip()

    if not day_name:
        day_name = start_date.strftime("%A").lower()
    if not time_text or time_text == "None":
        time_text = "99:99"

    schedule_date = start_date.isoformat()
    if time_text == "99:99":
        sort_at = f"{schedule_date}T23:59:00+09:00"
    else:
        hour_text, minute_text = time_text.split(":", 1)
        hour = int(hour_text)
        minute = int(minute_text)
        day_offset = 0
        if hour >= 24:
            hour -= 24
            day_offset = 1
        sort_day = start_date.toordinal() + day_offset
        sort_date = date.fromordinal(sort_day)
        sort_at = datetime.combine(sort_date, time(hour=hour, minute=minute)).isoformat() + "+09:00"

    return {
        "reference": "jp_fastest",
        "timezone": "Asia/Tokyo",
        "day_of_week": DAY_NAME_TO_CODE.get(day_name, "SUN"),
        "date": schedule_date,
        "time": time_text,
        "sort_at": sort_at,
        "episode_label": None,
    }


def parse_partial_date(raw_value: str, ref: SeasonRef) -> date:
    parts = str(raw_value or "").split("-")
    if len(parts) == 3:
        return date.fromisoformat(raw_value)
    if len(parts) == 2:
        return date(int(parts[0]), int(parts[1]), 1)
    if len(parts) == 1 and parts[0]:
        return date(int(parts[0]), SEASON_MONTH[ref.season], 1)
    return date(ref.year, SEASON_MONTH[ref.season], 1)


def detect_start_date_precision(raw_value: str | None) -> str:
    text = str(raw_value or "").strip()
    if not text:
        return "unknown"
    parts = [part for part in text.split("-") if part]
    if len(parts) >= 3:
        return "day"
    if len(parts) == 2:
        return "month"
    if len(parts) == 1:
        return "year"
    return "unknown"


def infer_schedule_meta(detail: dict[str, Any], ref: SeasonRef) -> dict[str, Any]:
    raw_start_date = str(detail.get("start_date") or "").strip() or None
    broadcast = detail.get("broadcast") or {}
    start_time = str(broadcast.get("start_time") or "").strip()
    time_known = bool(start_time and start_time != "None")
    precision = detect_start_date_precision(raw_start_date)

    if precision == "day":
        confidence = "confirmed"
    elif precision in {"month", "year"}:
        confidence = "seasonal"
    else:
        confidence = "tentative"

    inferred_season = infer_node_season(detail, ref)
    return {
        "raw_start_date": raw_start_date,
        "date_precision": precision,
        "time_known": time_known,
        "schedule_confidence": confidence,
        "inferred_season": {"year": inferred_season.year, "season": inferred_season.season} if inferred_season else None,
    }


def choose_titles(detail: dict[str, Any], page_titles: dict[str, str | None]) -> dict[str, Any]:
    alternatives = detail.get("alternative_titles") or {}
    synonyms = alternatives.get("synonyms") or []

    ja_title = alternatives.get("ja") or page_titles.get("ja") or detail.get("title") or ""
    en_title = alternatives.get("en") or page_titles.get("en") or detail.get("title") or ja_title
    short_title = synonyms[0] if synonyms else None

    return {
        "ja": ja_title,
        "en": en_title,
        "ko": None,
        "short": short_title,
    }


def existing_credits(entry: dict[str, Any] | None) -> dict[str, list[dict[str, Any]]]:
    credits = ((entry or {}).get("extensions") or {}).get("credits") or {}
    return {
        "characters": deepcopy(credits.get("characters") or []),
        "staff": deepcopy(credits.get("staff") or []),
    }


def build_entry(
    node: dict[str, Any],
    ref: SeasonRef,
    page_html: str,
    credits_html: str,
    existing_entry: dict[str, Any] | None = None,
) -> dict[str, Any]:
    anime_id = int(node["id"])
    page_titles = extract_titles_from_page(page_html)
    external_links = extract_external_links(page_html)
    media_type = str(node.get("media_type") or "unknown").lower()
    tags = [genre.get("name", "").strip() for genre in node.get("genres", []) if genre.get("name")]
    studios = [studio.get("name", "").strip() for studio in node.get("studios", []) if studio.get("name")]
    preserved_credits = existing_credits(existing_entry)
    parsed_characters = extract_characters(credits_html) if credits_html else []
    parsed_staff = extract_staff(credits_html) if credits_html else []
    schedule_meta = infer_schedule_meta(node, ref)

    return {
        "id": f"mal-anime-{anime_id}",
        "entity_type": "anime",
        "schedule_kind": "weekly_broadcast",
        "status": str(node.get("status") or "upcoming"),
        "season": {
            "year": int((node.get("start_season") or {}).get("year") or ref.year),
            "quarter": ref.season.upper(),
        },
        "titles": choose_titles(node, page_titles),
        "schedule": infer_schedule(node, ref),
        "broadcasters": {
            "network": None,
            "block": None,
        },
        "source_links": {
            "mal": f"https://myanimelist.net/anime/{anime_id}",
            "official": external_links.get("official"),
        },
        "availability": {
            "kr_streaming": None,
            "services": [],
        },
        "tags": [tag for tag in tags if tag],
        "notes": [],
        "extensions": {
            "media_type": media_type,
            "synopsis": node.get("synopsis"),
            "score": node.get("mean"),
            "rank": node.get("rank"),
            "popularity": node.get("popularity"),
            "source_material": node.get("source"),
            "studios": studios,
            "episode_meta": {
                "total_episodes": node.get("num_episodes"),
                "latest_broadcast_episode": None,
                "average_episode_duration_seconds": node.get("average_episode_duration"),
            },
            "links": {
                "x": external_links.get("x"),
            },
            "schedule_meta": schedule_meta,
            "credits": {
                "characters": parsed_characters or preserved_credits["characters"],
                "staff": parsed_staff or preserved_credits["staff"],
            },
        },
    }


def apply_override(entry: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = deepcopy(entry)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = apply_override(merged[key], value)
        else:
            merged[key] = deepcopy(value)
    return merged


def should_keep_media_type(detail: dict[str, Any]) -> bool:
    media_type = str(detail.get("media_type") or "").lower()
    return media_type in MEDIA_TYPE_ALLOWLIST


def ensure_dataset(payload: dict[str, Any]) -> dict[str, Any]:
    if payload:
        return payload
    return {
        "version": 1,
        "dataset": {
            "name": "Animation Calendar",
            "primary_source": "MyAnimeList API v2 + MAL HTML fallback",
            "timezone": "Asia/Tokyo",
            "locale": "ja-JP",
            "is_sample": False,
            "notes": [
                "Collector starts from 2026 Spring and can backfill older seasons over time.",
                "Missing fields may remain blank and can be patched through anime_overrides.json.",
            ],
        },
        "entries": [],
    }


def prune_sample_entries(entries: list[dict[str, Any]], *, first_live_run: bool) -> list[dict[str, Any]]:
    if not first_live_run:
        return entries
    return [entry for entry in entries if not str(entry.get("id", "")).startswith("sample-")]


def build_target_seasons(
    state: dict[str, Any],
    *,
    include_forward: bool = True,
    backfill_per_run_override: int | None = None,
) -> list[SeasonRef]:
    seed = season_from_dict(state.get("seed"), SeasonRef(2026, "spring"))
    current_ref = current_season()
    latest_forward = season_from_dict(state.get("latest_forward"), next_season(current_ref))
    if season_cmp(latest_forward, current_ref) < 0:
        latest_forward = current_ref

    targets: list[SeasonRef] = []
    if include_forward:
        cursor = current_ref
        while season_cmp(cursor, latest_forward) <= 0:
            targets.append(cursor)
            cursor = next_season(cursor)

    backfill_per_run = backfill_per_run_override
    if backfill_per_run is None:
        backfill_per_run = max(0, int(get_env("ANIME_BACKFILL_PER_RUN", "1") or "1"))
    next_backfill = season_from_dict(state.get("next_backfill"), previous_season(seed))
    for _ in range(backfill_per_run):
        if next_backfill.year < 1900:
            break
        targets.append(next_backfill)
        next_backfill = previous_season(next_backfill)

    unique_targets: list[SeasonRef] = []
    seen: set[str] = set()
    for target in targets:
        if target.key in seen:
            continue
        seen.add(target.key)
        unique_targets.append(target)
    return unique_targets


def discover_future_seasons(client: MalClient, start_from: SeasonRef) -> list[SeasonRef]:
    max_forward_scan = max(0, int(get_env("ANIME_FUTURE_SEASON_SCAN_LIMIT", "12") or "12"))
    discovered: list[SeasonRef] = []
    cursor = next_season(start_from)

    for _ in range(max_forward_scan):
        try:
            season_nodes = client.get_season(cursor.year, cursor.season)
        except MalClientError:
            break
        relevant_nodes = [
            node for node in season_nodes
            if should_keep_media_type(node) and matches_target_season(node, cursor, strict=True)
        ]
        if not relevant_nodes:
            break
        discovered.append(cursor)
        cursor = next_season(cursor)

    return discovered


def sync_seasons(
    progress_callback: ProgressCallback | None = None,
    *,
    include_forward: bool = True,
    backfill_per_run_override: int | None = None,
) -> None:
    client = MalClient.from_env()
    payload = ensure_dataset(load_json(SOURCE_DATA_FILE, {}))
    overrides = load_json(OVERRIDES_FILE, {})
    state = state_or_default()

    payload["dataset"]["primary_source"] = "MyAnimeList API v2 + MAL HTML fallback"
    payload["dataset"]["is_sample"] = False

    first_live_run = not state.get("completed_seasons")
    entries = prune_sample_entries(payload.get("entries", []), first_live_run=first_live_run)
    entry_index = {entry["id"]: entry for entry in entries}

    targets = build_target_seasons(
        state,
        include_forward=include_forward,
        backfill_per_run_override=backfill_per_run_override,
    )
    if include_forward:
        forward_anchor = season_from_dict(state.get("latest_forward"), next_season(current_season()))
        if season_cmp(forward_anchor, current_season()) < 0:
            forward_anchor = current_season()
        targets.extend(discover_future_seasons(client, forward_anchor))

    unique_targets: list[SeasonRef] = []
    seen_targets: set[str] = set()
    for target in targets:
        if target.key in seen_targets:
            continue
        seen_targets.add(target.key)
        unique_targets.append(target)
    targets = unique_targets
    completed = set(state.get("completed_seasons", []))

    for target_index, target in enumerate(targets, start=1):
        if progress_callback:
            progress_callback(
                "Fetching season list.",
                f"{target_index}/{len(targets)} -> {target.year} {target.season}",
            )

        season_nodes = client.get_season(target.year, target.season)
        strict_future_filter = season_cmp(target, next_season(current_season())) > 0
        relevant_nodes = [
            node for node in season_nodes
            if should_keep_media_type(node) and matches_target_season(node, target, strict=strict_future_filter)
        ]

        for item_index, node in enumerate(relevant_nodes, start=1):
            anime_id = int(node["id"])
            entry_id = f"mal-anime-{anime_id}"
            previous_entry = entry_index.get(entry_id)
            if progress_callback:
                progress_callback(
                    "Fetching anime detail.",
                    f"{target.year} {target.season}: {item_index}/{len(relevant_nodes)} MAL {anime_id}",
                )

            page_html = safe_page_fetch(client, anime_id)
            credits_html = ""
            if should_fetch_credits(previous_entry):
                if progress_callback:
                    progress_callback(
                        "Fetching cast / staff.",
                        f"{target.year} {target.season}: {item_index}/{len(relevant_nodes)} MAL {anime_id}",
                    )
                credits_html = safe_page_fetch(client, anime_id, "characters")
            entry = build_entry(node, target, page_html, credits_html, previous_entry)

            override = overrides.get(entry["id"]) or overrides.get(str(anime_id))
            if isinstance(override, dict):
                entry = apply_override(entry, override)
            entry_index[entry["id"]] = entry

        completed.add(target.key)

    seed = season_from_dict(state.get("seed"), SeasonRef(2026, "spring"))
    latest_forward = season_from_dict(state.get("latest_forward"), seed)
    if include_forward and targets:
        latest_forward = max(
            [target for target in targets if season_cmp(target, current_season()) >= 0],
            key=lambda item: (item.year, SEASONS.index(item.season)),
            default=latest_forward,
        )
    current_backfill = season_from_dict(state.get("next_backfill"), previous_season(seed))
    backfill_per_run = backfill_per_run_override
    if backfill_per_run is None:
        backfill_per_run = max(0, int(get_env("ANIME_BACKFILL_PER_RUN", "1") or "1"))
    for _ in range(backfill_per_run):
        current_backfill = previous_season(current_backfill)

    payload["entries"] = sorted(
        (sanitize_saved_links(entry) for entry in entry_index.values()),
        key=lambda entry: (entry["schedule"]["sort_at"], entry["id"]),
    )
    state["latest_forward"] = {"year": latest_forward.year, "season": latest_forward.season}
    state["next_backfill"] = {"year": current_backfill.year, "season": current_backfill.season}
    state["completed_seasons"] = sorted(completed)
    state["last_successful_sync_at"] = datetime.now().astimezone().isoformat(timespec="seconds")

    save_json(SOURCE_DATA_FILE, payload)
    save_json(SOURCE_STATE_FILE, state)


def safe_page_fetch(client: MalClient, anime_id: int, suffix: str = "") -> str:
    try:
        return client.get_page_html(anime_id, suffix)
    except MalClientError:
        return ""


def should_fetch_credits(existing_entry: dict[str, Any] | None = None) -> bool:
    mode = (get_env("ANIME_FETCH_CREDITS", "missing") or "missing").strip().lower()
    if mode in {"0", "false", "no", "off", "disabled"}:
        return False
    if mode in {"1", "true", "yes", "on", "all"}:
        return True

    credits = existing_credits(existing_entry)
    return not credits["characters"] or not credits["staff"]


def sanitize_saved_links(entry: dict[str, Any]) -> dict[str, Any]:
    source_links = dict(entry.get("source_links") or {})
    extensions = dict(entry.get("extensions") or {})
    links = dict(extensions.get("links") or {})

    source_links["official"] = normalize_official_link(source_links.get("official"))
    links["x"] = normalize_x_link(links.get("x"))

    extensions["links"] = links
    entry["source_links"] = source_links
    entry["extensions"] = extensions
    return entry


def main() -> None:
    sync_seasons()


if __name__ == "__main__":
    main()
