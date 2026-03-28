from __future__ import annotations

import sys

from app.refresh_all import main as refresh_all_main
from app.viewer import main as viewer_main


def main(argv: list[str] | None = None) -> None:
    args = list(argv if argv is not None else sys.argv[1:])
    mode = args[0] if args else "viewer"

    if mode == "update":
        refresh_all_main()
        return
    if mode == "backfill_year":
        refresh_all_main(include_forward=False, backfill_per_run_override=4, link_refresh_limit_override=320)
        return
    if mode == "viewer":
        viewer_main()
        return
    if mode == "update_and_viewer":
        refresh_all_main()
        viewer_main()
        return
    raise SystemExit(f"Unsupported run mode: {mode}")


if __name__ == "__main__":
    main()
