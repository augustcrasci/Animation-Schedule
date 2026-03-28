from __future__ import annotations

import sys

from app.calendar_common import has_mal_client_id
from app.refresh_all import main as refresh_all_main
from app.viewer import main as viewer_main


def require_mal_client_id() -> None:
    if not has_mal_client_id():
        raise SystemExit(
            "MAL_CLIENT_ID is missing. Add your own MAL Client ID to .env to run updates. "
            "Viewer mode can still be used without API credentials."
        )


def main(argv: list[str] | None = None) -> None:
    args = list(argv if argv is not None else sys.argv[1:])
    mode = args[0] if args else "viewer"

    if mode == "update_fast":
        require_mal_client_id()
        refresh_all_main(
            include_forward=True,
            backfill_per_run_override=0,
            refresh_external_links=False,
            enrich_japanese_names=False,
        )
        return
    if mode == "update":
        require_mal_client_id()
        refresh_all_main(
            include_forward=True,
            backfill_per_run_override=0,
        )
        return
    if mode == "backfill_year":
        require_mal_client_id()
        refresh_all_main(include_forward=False, backfill_per_run_override=4, link_refresh_limit_override=320)
        return
    if mode == "viewer":
        viewer_main()
        return
    if mode == "update_and_viewer":
        if has_mal_client_id():
            refresh_all_main(
                include_forward=True,
                backfill_per_run_override=0,
            )
        viewer_main()
        return
    raise SystemExit(f"Unsupported run mode: {mode}")


if __name__ == "__main__":
    main()
