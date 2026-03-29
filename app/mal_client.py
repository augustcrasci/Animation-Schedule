from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.calendar_common import get_env


API_ROOT = "https://api.myanimelist.net/v2"
USER_AGENT = "animation-calendar/0.1"
_LAST_REQUEST_AT = 0.0


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

    def _throttle(self) -> None:
        global _LAST_REQUEST_AT
        interval = max(0.0, float(get_env("MAL_REQUEST_INTERVAL_SECONDS", "0.35") or "0.35"))
        if not interval:
            return
        elapsed = time.time() - _LAST_REQUEST_AT
        if elapsed < interval:
            time.sleep(interval - elapsed)

    def _headers(self) -> dict[str, str]:
        return {
            "X-MAL-CLIENT-ID": self.client_id,
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        }

    def _request_json(self, url: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        global _LAST_REQUEST_AT
        if params:
            query = urlencode({key: value for key, value in params.items() if value is not None})
            url = f"{url}?{query}"

        request = Request(url, headers=self._headers(), method="GET")
        attempts = 3
        for attempt in range(attempts):
            self._throttle()
            try:
                with urlopen(request, timeout=60) as response:
                    data = json.loads(response.read().decode("utf-8"))
                _LAST_REQUEST_AT = time.time()
                return data
            except HTTPError as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                if exc.code in {405, 429, 500, 502, 503, 504} and attempt + 1 < attempts:
                    time.sleep(1.5 * (attempt + 1))
                    continue
                raise MalClientError(f"MAL API request failed: {url}") from exc
            except Exception as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                raise MalClientError(f"MAL API request failed: {url}") from exc
        raise MalClientError(f"MAL API request failed: {url}")

    def _request_text(self, url: str) -> str:
        global _LAST_REQUEST_AT
        request = Request(url, headers={"User-Agent": USER_AGENT}, method="GET")
        attempts = 3
        for attempt in range(attempts):
            self._throttle()
            try:
                with urlopen(request, timeout=60) as response:
                    text = response.read().decode("utf-8", errors="replace")
                _LAST_REQUEST_AT = time.time()
                if "Human Verification" in text and attempt + 1 < attempts:
                    time.sleep(2.0 * (attempt + 1))
                    continue
                if "Human Verification" in text:
                    raise MalClientError(f"MAL page request failed: {url}")
                return text
            except HTTPError as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                if exc.code in {405, 429, 500, 502, 503, 504} and attempt + 1 < attempts:
                    time.sleep(2.0 * (attempt + 1))
                    continue
                raise MalClientError(f"MAL page request failed: {url}") from exc
            except Exception as exc:  # pragma: no cover - network error branch
                _LAST_REQUEST_AT = time.time()
                raise MalClientError(f"MAL page request failed: {url}") from exc
        raise MalClientError(f"MAL page request failed: {url}")

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
