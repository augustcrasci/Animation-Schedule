from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.request import Request, urlopen


API_ROOT = "https://graphql.anilist.co"
USER_AGENT = "animation-calendar/0.1"


class AniListClientError(RuntimeError):
    """Raised when AniList API access fails."""


@dataclass(slots=True)
class AniListClient:
    def _request_json(self, query: str, variables: dict[str, Any]) -> dict[str, Any]:
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
        try:
            with urlopen(request, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
        except Exception as exc:  # pragma: no cover - network error branch
            raise AniListClientError("AniList API request failed.") from exc

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
