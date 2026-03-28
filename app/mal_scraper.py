from __future__ import annotations

import html
import json
import re
from typing import Any
from urllib.parse import urlparse


def _clean_text(value: str | None) -> str:
    text = html.unescape(str(value or ""))
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _slice_section(page_html: str, start_markers: list[str], end_markers: list[str]) -> str:
    start_positions = [page_html.find(marker) for marker in start_markers if page_html.find(marker) != -1]
    if not start_positions:
        return page_html

    start = min(start_positions)
    end_positions = [page_html.find(marker, start + 1) for marker in end_markers if page_html.find(marker, start + 1) != -1]
    end = min(end_positions) if end_positions else len(page_html)
    return page_html[start:end]


def _entry_blocks(section_html: str) -> list[str]:
    marker = '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
    parts = section_html.split(marker)
    return [part for part in parts[1:] if part.strip()]


def extract_external_links(page_html: str) -> dict[str, str | None]:
    official_match = re.search(
        r'<a href="([^"]+)"[^>]*data-ga-click-type="external-links-anime-pc-official-site"[^>]*>.*?<div class="caption">Official Site</div>',
        page_html,
        re.IGNORECASE | re.DOTALL,
    )
    x_match = re.search(
        r'<a href="([^"]+)"[^>]*data-ga-click-type="external-links-anime-pc-(?:twitter|x)"[^>]*>.*?<div class="caption">(?:@[^<]+|X|Twitter)</div>',
        page_html,
        re.IGNORECASE | re.DOTALL,
    )
    official = normalize_official_link(html.unescape(official_match.group(1)) if official_match else None)
    x_link = normalize_x_link(html.unescape(x_match.group(1)) if x_match else None)
    return {"official": official, "x": x_link}


def _extract_json_ld(page_html: str) -> dict[str, Any]:
    match = re.search(
        r"<script[^>]*type=\"application/ld\+json\"[^>]*>\s*(\{.*?\})\s*</script>",
        page_html,
        re.DOTALL | re.IGNORECASE,
    )
    if not match:
        return {}
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return {}


def extract_titles_from_page(page_html: str) -> dict[str, str | None]:
    json_ld = _extract_json_ld(page_html)
    japanese_title = json_ld.get("name")
    english_title = None

    title_match = re.search(r"<title>(.*?)\s*-\s*MyAnimeList\.net</title>", page_html, re.IGNORECASE | re.DOTALL)
    if title_match:
        english_title = _clean_text(title_match.group(1))

    return {
        "ja": _clean_text(japanese_title) or None,
        "en": _clean_text(english_title) or None,
    }


def extract_person_name_ja(page_html: str) -> str | None:
    given_match = re.search(r'<span class="dark_text">Given name:</span>\s*([^<]+)', page_html, re.IGNORECASE)
    family_match = re.search(r'<span class="dark_text">Family name:</span>\s*([^<]+)', page_html, re.IGNORECASE)
    given_name = _clean_text(given_match.group(1) if given_match else "")
    family_name = _clean_text(family_match.group(1) if family_match else "")

    if family_name and given_name:
        return f"{family_name} {given_name}"
    return family_name or given_name or None


def extract_character_name_ja(page_html: str) -> str | None:
    match = re.search(
        r'<h2 class="normal_header"[^>]*>.*?<small>\(([^)]+)\)</small></span></h2>',
        page_html,
        re.IGNORECASE | re.DOTALL,
    )
    if not match:
        return None
    return _clean_text(match.group(1)) or None


def extract_characters(page_html: str, *, limit: int = 12) -> list[dict[str, str]]:
    section_html = _slice_section(
        page_html,
        ['<h2 id="characters">Characters & Voice Actors</h2>', "Characters & Voice Actors</h2>"],
        ['<a name="staff"></a>', "<h2>Staff</h2>"],
    )
    character_pattern = re.compile(
        r"https?://myanimelist\.net/character/(\d+)/[^\"]*\"[^>]*>([^<]+)</a>.*?<small>([^<]*)</small>",
        re.IGNORECASE | re.DOTALL,
    )
    voice_actor_pattern = re.compile(
        r"https?://myanimelist\.net/people/(\d+)/[^\"]*\"[^>]*>([^<]+)</a><br>\s*<small>([^<]+)</small>",
        re.IGNORECASE | re.DOTALL,
    )
    results: list[dict[str, str]] = []
    seen: set[str] = set()
    for block in _entry_blocks(section_html):
        character_match = character_pattern.search(block)
        if not character_match:
            continue
        character_id = character_match.group(1)
        if character_id in seen:
            continue
        seen.add(character_id)
        voice_actor_match = voice_actor_pattern.search(block)
        results.append(
            {
                "character_mal_id": character_id,
                "character_name": _clean_text(character_match.group(2)),
                "character_role": _clean_text(character_match.group(3)),
                "voice_actor_mal_id": voice_actor_match.group(1) if voice_actor_match else "",
                "voice_actor_name": _clean_text(voice_actor_match.group(2) if voice_actor_match else ""),
                "language": _clean_text(voice_actor_match.group(3) if voice_actor_match else ""),
            }
        )
        if len(results) >= limit:
            break
    return results


def extract_staff(page_html: str, *, limit: int = 12) -> list[dict[str, str]]:
    section_html = _slice_section(
        page_html,
        ['<a name="staff"></a>', "<h2>Staff</h2>"],
        [],
    )
    pattern = re.compile(
        r"https?://myanimelist\.net/people/(\d+)/[^\"]*\"[^>]*>([^<]+)</a>.*?<small>([^<]+)</small>",
        re.IGNORECASE | re.DOTALL,
    )
    results: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for block in _entry_blocks(section_html):
        match = pattern.search(block)
        if not match:
            continue
        key = (_clean_text(match.group(2)), _clean_text(match.group(3)))
        if key in seen:
            continue
        seen.add(key)
        results.append(
            {
                "person_mal_id": match.group(1),
                "name": key[0],
                "role": key[1],
            }
        )
        if len(results) >= limit:
            break
    return results


def normalize_official_link(url: str | None) -> str | None:
    if not url or not url.startswith(("http://", "https://")):
        return None

    parsed = urlparse(url)
    host = (parsed.netloc or "").lower()
    blocked_hosts = (
        "myanimelist.net",
        "twitter.com",
        "x.com",
        "anidb.net",
        "wikipedia.org",
        "namu.wiki",
        "bangumi.tv",
    )
    if any(host == blocked or host.endswith(f".{blocked}") for blocked in blocked_hosts):
        return None
    return url


def normalize_x_link(url: str | None) -> str | None:
    if not url or not url.startswith(("http://", "https://")):
        return None

    parsed = urlparse(url)
    host = (parsed.netloc or "").lower()
    if host == "twitter.com" or host.endswith(".twitter.com") or host == "x.com" or host.endswith(".x.com"):
        return url
    return None
