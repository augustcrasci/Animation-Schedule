from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any


ROOT_DIR = Path(__file__).resolve().parent.parent
APP_DIR = ROOT_DIR / "app"
DATA_DIR = ROOT_DIR / "data"
WEB_DIR = ROOT_DIR / "web"
PID_FILE = ROOT_DIR / ".viewer.pid"
ENV_FILE = ROOT_DIR / ".env"
SOURCE_DATA_FILE = DATA_DIR / "anime_schedule.json"
COMPILED_DATA_FILE = DATA_DIR / "anime_schedule_compiled.json"
CHANGE_SUMMARY_FILE = DATA_DIR / "change_summary.json"
SOURCE_STATE_FILE = DATA_DIR / "source_state.json"
OVERRIDES_FILE = DATA_DIR / "anime_overrides.json"


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def load_dotenv(path: Path = ENV_FILE) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def get_env(name: str, default: str | None = None) -> str | None:
    load_dotenv()
    return os.environ.get(name, default)


def load_json(path: str | Path, default: Any) -> Any:
    target = Path(path)
    if not target.is_absolute():
        target = DATA_DIR / target
    if not target.exists():
        return default
    try:
        return json.loads(target.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def save_json(path: str | Path, payload: Any) -> None:
    target = Path(path)
    if not target.is_absolute():
        target = DATA_DIR / target
    ensure_parent(target)
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
