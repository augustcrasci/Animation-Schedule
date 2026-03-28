from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.calendar_common import get_env


API_ROOT = "https://api.myanimelist.net/v2"
USER_AGENT = "animation-calendar/0.1"


class MalClientError(RuntimeError):
    """Raised when MAL API access fails."""


@dataclass(slots=True)
class MalClient:
    client_id: str

    @classmethod
    def from_env(cls) -> "MalClient":
        client_id = get_env("MAL_CLIENT_ID")
        if not client_id:
            raise MalClientError("MAL_CLIENT_ID is missing. Add it to .env before running the collector.")
        return cls(client_id=client_id)

    def _headers(self) -> dict[str, str]:
        return {
            "X-MAL-CLIENT-ID": self.client_id,
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        }

    def _request_json(self, url: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        if params:
            query = urlencode({key: value for key, value in params.items() if value is not None})
            url = f"{url}?{query}"

        request = Request(url, headers=self._headers(), method="GET")
        try:
            with urlopen(request, timeout=60) as response:
                return json.loads(response.read().decode("utf-8"))
        except Exception as exc:  # pragma: no cover - network error branch
            raise MalClientError(f"MAL API request failed: {url}") from exc

    def _request_text(self, url: str) -> str:
        request = Request(url, headers={"User-Agent": USER_AGENT}, method="GET")
        try:
            with urlopen(request, timeout=60) as response:
                return response.read().decode("utf-8", errors="replace")
        except Exception as exc:  # pragma: no cover - network error branch
            raise MalClientError(f"MAL page request failed: {url}") from exc

    def get_season(self, year: int, season: str, *, limit: int = 100) -> list[dict[str, Any]]:
        fields = ",".join(
            [
                "id",
                "title",
                "alternative_titles",
                "start_date",
                "end_date",
                "media_type",
                "status",
                "genres",
                "num_episodes",
                "start_season",
                "broadcast",
                "source",
                "average_episode_duration",
                "studios",
                "synopsis",
                "mean",
                "rank",
                "popularity",
            ]
        )

        results: list[dict[str, Any]] = []
        next_url = f"{API_ROOT}/anime/season/{year}/{season}"
        params: dict[str, Any] | None = {"limit": limit, "fields": fields}

        while next_url:
            payload = self._request_json(next_url, params=params)
            params = None
            for item in payload.get("data", []):
                node = item.get("node") or {}
                if node:
                    results.append(node)
            next_url = payload.get("paging", {}).get("next")

        return results

    def get_page_html(self, anime_id: int, suffix: str = "") -> str:
        url = f"https://myanimelist.net/anime/{anime_id}"
        if suffix:
            url = f"{url}/{suffix}"
        return self._request_text(url)

    def get_person_page_html(self, person_id: int) -> str:
        return self._request_text(f"https://myanimelist.net/people/{person_id}")

    def get_character_page_html(self, character_id: int) -> str:
        return self._request_text(f"https://myanimelist.net/character/{character_id}")
