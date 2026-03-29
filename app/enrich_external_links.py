from __future__ import annotations

from datetime import datetime
from typing import Any, Callable

from app.calendar_common import SOURCE_DATA_FILE, get_env, load_json, save_json
from app.mal_client import MalClient, MalClientError
from app.mal_scraper import extract_external_links, normalize_official_link, normalize_x_link


ProgressCallback = Callable[[str, str], None]
SEASON_INDEX = {"WINTER": 4, "FALL": 3, "SUMMER": 2, "SPRING": 1}


def needs_link_refresh(entry: dict[str, Any]) -> bool:
    source_links = entry.get("source_links") or {}
    return not normalize_official_link(source_links.get("official"))


def link_candidate_sort_key(entry: dict[str, Any]) -> tuple[int, int, int, int, str]:
    season = entry.get("season") or {}
    year = int(season.get("year") or 0)
    quarter = str(season.get("quarter") or "").upper()
    status = str(entry.get("status") or "").lower()
    popularity = int(((entry.get("extensions") or {}).get("popularity") or 999999))
    status_rank = 0 if status in {"currently_airing", "airing", "not_yet_aired", "upcoming"} else 1
    return (status_rank, popularity, -year, -SEASON_INDEX.get(quarter, 0), str(entry.get("id") or ""))


def enrich_external_links(
    *,
    limit: int | None = None,
    year_filter: int | None = None,
    progress_callback: ProgressCallback | None = None,
) -> bool:
    payload = load_json(SOURCE_DATA_FILE, {})
    if not payload:
        return False

    if limit is None:
        limit = max(0, int(get_env("ANIME_ENRICH_LINKS_PER_RUN", "120") or "120"))

    entries = payload.get("entries", [])
    candidates = [
        entry for entry in entries
        if needs_link_refresh(entry) and (year_filter is None or int((entry.get("season") or {}).get("year") or 0) == int(year_filter))
    ]
    candidates.sort(key=link_candidate_sort_key)
    if limit > 0:
        candidates = candidates[:limit]
    if not candidates:
        return False

    client = MalClient.from_env()
    changed = False

    for index, entry in enumerate(candidates, start=1):
        anime_id_text = str(entry.get("id") or "").rsplit("-", 1)[-1]
        if not anime_id_text.isdigit():
            continue
        anime_id = int(anime_id_text)
        if progress_callback:
            progress_callback("Refreshing official links.", f"{index}/{len(candidates)} MAL {anime_id}")
        try:
            page_html = client.get_page_html(anime_id)
        except MalClientError:
            continue

        external_links = extract_external_links(page_html)
        source_links = dict(entry.get("source_links") or {})
        extensions = dict(entry.get("extensions") or {})
        links = dict(extensions.get("links") or {})

        official = normalize_official_link(source_links.get("official")) or external_links.get("official")
        x_link = normalize_x_link(links.get("x"))
        if official and not x_link:
            x_link = external_links.get("x")

        if source_links.get("official") != official:
            source_links["official"] = official
            changed = True
        if links.get("x") != x_link:
            links["x"] = x_link
            changed = True

        extensions["links"] = links
        entry["source_links"] = source_links
        entry["extensions"] = extensions

    if changed:
        payload.setdefault("dataset", {})["last_link_refresh_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
        save_json(SOURCE_DATA_FILE, payload)
    return changed


def main() -> None:
    enrich_external_links()


if __name__ == "__main__":
    main()
