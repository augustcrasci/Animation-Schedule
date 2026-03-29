from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from app.calendar_common import get_env

API_ROOT = "https://graphql.anilist.co"
USER_AGENT = "animation-calendar/0.1"
_LAST_REQUEST_AT = 0.0


class AniListClientError(RuntimeError):
    """Raised when AniList API access fails."""


@dataclass(slots=True)
class AniListClient:
    def _throttle(self) -> None:
        global _LAST_REQUEST_AT
        interval = max(0.0, float(get_env("ANILIST_REQUEST_INTERVAL_SECONDS", "0.35") or "0.35"))
        if not interval:
            return
        elapsed = time.time() - _LAST_REQUEST_AT
        if elapsed < interval:
            time.sleep(interval - elapsed)

    def _request_json(self, query: str, variables: dict[str, Any]) -> dict[str, Any]:
        global _LAST_REQUEST_AT
        payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
        request = Request(
            API_ROOT,
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": USER_AGENT,
            },
            method="POST",
        )
        attempts = 2
        for attempt in range(attempts):
            self._throttle()
            try:
                with urlopen(request, timeout=60) as response:
                    data = json.loads(response.read().decode("utf-8"))
                _LAST_REQUEST_AT = time.time()
                break
            except HTTPError as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                if exc.code == 429 and attempt + 1 < attempts:
                    time.sleep(2.0)
                    continue
                raise AniListClientError("AniList API request failed.") from exc
            except Exception as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                raise AniListClientError("AniList API request failed.") from exc
        else:  # pragma: no cover - defensive
            raise AniListClientError("AniList API request failed.")

        if data.get("errors"):
            raise AniListClientError(f"AniList API returned errors: {data['errors']}")
        return data.get("data") or {}

    def get_media_name_bundle(self, mal_id: int) -> dict[str, Any]:
        query = """
        query ($malId: Int) {
          Media(idMal: $malId, type: ANIME) {
            idMal
            title { native romaji english }
            characters(page: 1, perPage: 25, sort: [ROLE, RELEVANCE, ID]) {
              edges {
                role
                node { id name { full native } }
                voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
                  id
                  name { full native }
                }
              }
            }
            staff(page: 1, perPage: 25, sort: [RELEVANCE, ID]) {
              edges {
                role
                node { id name { full native } }
              }
            }
          }
        }
        """
        data = self._request_json(query, {"malId": mal_id})
        return data.get("Media") or {}
