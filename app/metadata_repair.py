from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import Any, Callable

from app.calendar_common import CHANGE_SUMMARY_FILE, COMPILED_DATA_FILE, SOURCE_DATA_FILE, SOURCE_STATE_FILE, get_env, load_json, save_json
from app.enrich_credits import enrich_credits
from app.enrich_external_links import enrich_external_links
from app.enrich_names import enrich_names
from app.refresh_all import build_change_summary, compile_payload


ProgressCallback = Callable[[str, str], None]


def update_repair_state(year: int) -> None:
    state = load_json(SOURCE_STATE_FILE, {})
    repaired_years = sorted({int(item) for item in (state.get("repaired_metadata_years") or []) if str(item).isdigit()} | {int(year)})
    state["repaired_metadata_years"] = repaired_years
    state["last_metadata_repair_year"] = int(year)
    state["last_metadata_repair_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
    save_json(SOURCE_STATE_FILE, state)


def year_gap_summary() -> dict[int, dict[str, int]]:
    payload = load_json(SOURCE_DATA_FILE, {})
    rows: dict[int, dict[str, int]] = defaultdict(lambda: {
        "total": 0,
        "official_empty": 0,
        "chars_empty": 0,
        "staff_empty": 0,
        "both_empty": 0,
    })

    for entry in payload.get("entries", []):
        year = int((entry.get("season") or {}).get("year") or 0)
        if not year:
            continue
        source_links = entry.get("source_links") or {}
        credits = ((entry.get("extensions") or {}).get("credits") or {})
        has_chars = bool(credits.get("characters") or [])
        has_staff = bool(credits.get("staff") or [])

        rows[year]["total"] += 1
        rows[year]["official_empty"] += 0 if source_links.get("official") else 1
        rows[year]["chars_empty"] += 0 if has_chars else 1
        rows[year]["staff_empty"] += 0 if has_staff else 1
        rows[year]["both_empty"] += 0 if (has_chars or has_staff) else 1

    return dict(sorted(rows.items()))


def next_repair_year() -> int | None:
    summary = year_gap_summary()
    min_year = int(get_env("ANIME_METADATA_REPAIR_START_YEAR", "2017") or "2017")
    state = load_json(SOURCE_STATE_FILE, {})
    repaired_years = {
        int(item) for item in (state.get("repaired_metadata_years") or [])
        if str(item).isdigit()
    }

    for year in sorted(summary):
        if year < min_year:
            continue
        row = summary[year]
        if year in repaired_years:
            continue
        if row["official_empty"] or row["both_empty"]:
            return year
    return None


def repair_metadata_year(progress_callback: ProgressCallback | None = None) -> int | None:
    year = next_repair_year()
    if year is None:
        return None

    if progress_callback:
        progress_callback("Repairing archived metadata.", f"{year}년 작품의 공식 링크와 캐스트/스태프를 복구합니다.")

    enrich_external_links(limit=0, year_filter=year, progress_callback=progress_callback)
    enrich_credits(limit_override=0, year_filter=year, progress_callback=progress_callback)
    if progress_callback:
        progress_callback("Repairing archived metadata.", f"{year}?? ?쇰낯??씠由?蹂듦뎄瑜??쒖옉?⑸땲??")
    enrich_names(year_filter=year, progress_callback=progress_callback)

    source_payload = load_json(SOURCE_DATA_FILE, {})
    previous_payload = load_json(COMPILED_DATA_FILE, {"entries": []})
    update_repair_state(year)
    if progress_callback:
        progress_callback("Rebuilding compiled data.", f"{year}??蹂듦뎄 寃곌낵瑜?compiled JSON濡?諛섏쁺?⑸땲??")
    compiled_payload = compile_payload(source_payload)
    save_json(COMPILED_DATA_FILE, compiled_payload)
    save_json(CHANGE_SUMMARY_FILE, build_change_summary(previous_payload.get("entries", []), compiled_payload["entries"]))
    return year
