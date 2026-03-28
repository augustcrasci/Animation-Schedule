from __future__ import annotations

import subprocess
import sys
import threading
import tkinter as tk
from datetime import datetime
from pathlib import Path
from tkinter import messagebox

from app.calendar_common import COMPILED_DATA_FILE, PID_FILE, ROOT_DIR, SOURCE_STATE_FILE, has_mal_client_id, load_json
from app.refresh_all import main as refresh_all_main


SEASON_LABELS = {
    "WINTER": "겨울",
    "SPRING": "봄",
    "SUMMER": "여름",
    "FALL": "가을",
}

ACTION_META = {
    "viewer": {
        "title": "현재 DB로 뷰어 열기",
        "detail": "저장된 DB로 바로 엽니다.",
        "button": "뷰어 열기",
    },
    "update_fast": {
        "title": "빠른 최신 갱신",
        "detail": "이번 분기와 미래 분기만 빠르게 갱신합니다.",
        "button": "빠른 갱신",
    },
    "update": {
        "title": "최신 시즌 풀 재동기화",
        "detail": "이번 분기와 미래 분기를 링크/이름 보강까지 다시 갱신합니다.",
        "button": "풀 재동기화",
    },
    "update_and_viewer": {
        "title": "최신 시즌 풀 재동기화 후 뷰어 열기",
        "detail": "풀 재동기화 완료 후 바로 뷰어를 엽니다.",
        "button": "갱신 후 열기",
    },
    "backfill_year": {
        "title": "과거 1년치 추가 수집",
        "detail": "과거 시즌 4개를 추가 저장합니다.",
        "button": "과거 1년 추가",
    },
}


def resolve_pythonw() -> str:
    executable = Path(sys.executable)
    pythonw = executable.with_name("pythonw.exe")
    return str(pythonw if pythonw.exists() else executable)


def stop_existing_viewer() -> None:
    if not PID_FILE.exists():
        return
    try:
        pid = PID_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        return
    if not pid.isdigit():
        PID_FILE.unlink(missing_ok=True)
        return
    subprocess.run(
        ["taskkill", "/PID", pid, "/T", "/F"],
        cwd=ROOT_DIR,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )
    PID_FILE.unlink(missing_ok=True)


def launch_viewer_process() -> None:
    stop_existing_viewer()
    subprocess.Popen(
        [resolve_pythonw(), "-m", "app.run_mode", "viewer"],
        cwd=ROOT_DIR,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )


def format_timestamp(value: str | None) -> str:
    if not value:
        return "기록 없음"
    try:
        dt = datetime.fromisoformat(value)
        return dt.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return str(value)


def format_season_ref(value: dict[str, object] | None) -> str:
    if not value:
        return "기록 없음"
    year = value.get("year")
    season = value.get("quarter") or value.get("season")
    if not year or not season:
        return "기록 없음"
    return f"{year} {SEASON_LABELS.get(str(season).upper(), str(season))}"


def load_launcher_status() -> dict[str, str]:
    source_state = load_json(SOURCE_STATE_FILE, {})
    compiled = load_json(COMPILED_DATA_FILE, {})
    collector_status = compiled.get("collector_status", {}) if isinstance(compiled, dict) else {}
    summary = compiled.get("summary", {}) if isinstance(compiled, dict) else {}

    total_entries = summary.get("total_entries")
    total_entries_text = f"{total_entries:,}개 작품" if isinstance(total_entries, int) else "기록 없음"

    return {
        "last_live_sync": format_timestamp(
            collector_status.get("last_live_sync_at") or source_state.get("last_successful_sync_at")
        ),
        "last_build": format_timestamp(compiled.get("generated_at") if isinstance(compiled, dict) else None),
        "oldest_completed": format_season_ref(collector_status.get("oldest_completed_season")),
        "next_backfill": format_season_ref(
            collector_status.get("next_backfill") or source_state.get("next_backfill")
        ),
        "total_entries": total_entries_text,
    }


class LauncherApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("애니메이션 캘린더")
        self.root.resizable(False, False)
        self.root.configure(bg="#edf4ff")

        self.status_var = tk.StringVar(value="실행할 작업을 선택해 주세요.")
        self.detail_var = tk.StringVar(value="최신 갱신, 풀 재동기화, 과거 백필을 분리해서 실행할 수 있습니다.")
        self.credential_var = tk.StringVar()
        self.db_status_var = tk.StringVar()
        self.backfill_var = tk.StringVar()
        self.build_var = tk.StringVar()
        self.buttons_by_mode: dict[str, tk.Button] = {}

        outer = tk.Frame(root, bg="#edf4ff", padx=18, pady=18)
        outer.pack(fill="both", expand=True)

        card = tk.Frame(outer, bg="#fcfdff", padx=20, pady=20, bd=1, relief="solid", highlightthickness=0)
        card.pack(fill="both", expand=True)

        tk.Label(card, text="애니메이션 캘린더", font=("Malgun Gothic", 15, "bold"), bg="#fcfdff", fg="#16233a").pack(anchor="w")
        tk.Frame(card, height=8, bg="#fcfdff").pack()

        actions_frame = tk.Frame(card, bg="#fcfdff")
        actions_frame.pack(fill="x")

        for mode in ("viewer", "update_fast", "update", "update_and_viewer", "backfill_year"):
            self._make_action_row(actions_frame, mode)

        status_box = tk.Frame(card, bg="#f3f7ff", padx=12, pady=12, bd=1, relief="solid")
        status_box.pack(fill="x", pady=(14, 0))
        tk.Label(status_box, text="현재 DB 상태", font=("Malgun Gothic", 10, "bold"), bg="#f3f7ff", fg="#16233a").pack(anchor="w")
        tk.Label(status_box, textvariable=self.credential_var, font=("Malgun Gothic", 9, "bold"), bg="#f3f7ff", fg="#28446d").pack(anchor="w", pady=(6, 0))
        tk.Label(status_box, textvariable=self.db_status_var, font=("Malgun Gothic", 9), bg="#f3f7ff", fg="#3e4d66", justify="left").pack(anchor="w", pady=(4, 0))
        tk.Label(status_box, textvariable=self.backfill_var, font=("Malgun Gothic", 9), bg="#f3f7ff", fg="#3e4d66", justify="left").pack(anchor="w", pady=(2, 0))
        tk.Label(status_box, textvariable=self.build_var, font=("Malgun Gothic", 9), bg="#f3f7ff", fg="#3e4d66", justify="left").pack(anchor="w", pady=(6, 0))

        bottom = tk.Frame(card, bg="#fcfdff")
        bottom.pack(fill="x", pady=(14, 0))
        tk.Label(
            bottom,
            textvariable=self.status_var,
            justify="left",
            wraplength=420,
            font=("Malgun Gothic", 9, "bold"),
            bg="#fcfdff",
            fg="#263349",
        ).pack(anchor="w")
        tk.Label(
            bottom,
            textvariable=self.detail_var,
            justify="left",
            wraplength=420,
            font=("Malgun Gothic", 9),
            bg="#fcfdff",
            fg="#627089",
        ).pack(anchor="w", pady=(4, 0))

        self.refresh_status_panel()

    def _make_action_row(self, parent: tk.Widget, mode: str) -> None:
        meta = ACTION_META[mode]
        row = tk.Frame(parent, bg="#ffffff", padx=12, pady=10, bd=1, relief="solid")
        row.pack(fill="x", pady=5)

        text_col = tk.Frame(row, bg="#ffffff")
        text_col.pack(side="left", fill="both", expand=True)

        tk.Label(text_col, text=meta["title"], font=("Malgun Gothic", 10, "bold"), bg="#ffffff", fg="#16233a").pack(anchor="w")
        tk.Label(
            text_col,
            text=meta["detail"],
            font=("Malgun Gothic", 9),
            bg="#ffffff",
            fg="#5b6578",
            justify="left",
            wraplength=300,
        ).pack(anchor="w", pady=(4, 0))

        button = tk.Button(
            row,
            text=meta["button"],
            command=lambda selected_mode=mode: self.start(selected_mode),
            width=14,
            pady=6,
            bg="#1c5bd6",
            fg="#ffffff",
            activebackground="#184db5",
            activeforeground="#ffffff",
            relief="flat",
            cursor="hand2",
            font=("Malgun Gothic", 9, "bold"),
        )
        button.pack(side="right", padx=(12, 0))
        self.buttons_by_mode[mode] = button

    def refresh_status_panel(self) -> None:
        status = load_launcher_status()
        has_key = has_mal_client_id()

        if has_key:
            self.credential_var.set("본인 MAL Client ID가 설정되어 있습니다. 최신 갱신과 과거 백필을 실행할 수 있습니다.")
        else:
            self.credential_var.set("MAL Client ID가 없습니다. 현재 DB로 뷰어만 열 수 있고, DB 업데이트는 비활성화됩니다.")

        self.db_status_var.set(
            f"최신 시즌 갱신 기준: {status['last_live_sync']} | 현재 저장 작품 수: {status['total_entries']}"
        )
        self.backfill_var.set(
            f"과거 백필 완료 범위: {status['oldest_completed']}까지 | 다음 백필 목표: {status['next_backfill']}"
        )
        self.build_var.set(f"마지막 compiled 빌드: {status['last_build']}")

        for mode, button in self.buttons_by_mode.items():
            is_update_action = mode in {"update_fast", "update", "backfill_year", "update_and_viewer"}
            button.configure(state=tk.NORMAL if (has_key or not is_update_action) else tk.DISABLED)

    def set_busy(self, busy: bool) -> None:
        if busy:
            for button in self.buttons_by_mode.values():
                button.configure(state=tk.DISABLED)
            return
        self.refresh_status_panel()

    def set_progress(self, message: str, detail: str = "") -> None:
        self.root.after(0, lambda: self._apply_progress(message, detail))

    def _apply_progress(self, message: str, detail: str) -> None:
        self.status_var.set(message)
        self.detail_var.set(detail)

    def start(self, mode: str) -> None:
        self.set_busy(True)
        self._apply_progress(f"{ACTION_META[mode]['title']} 실행 중입니다.", ACTION_META[mode]["detail"])
        threading.Thread(target=self.run_mode, args=(mode,), daemon=True).start()

    def run_mode(self, mode: str) -> None:
        try:
            if mode == "viewer":
                self.set_progress("현재 저장된 DB로 뷰어를 여는 중입니다.", "브라우저를 여는 중입니다.")
                launch_viewer_process()
                self.root.after(0, self.finish_viewer_launch)
                return

            if mode == "update_fast":
                refresh_all_main(
                    progress_callback=self.set_progress,
                    include_forward=True,
                    backfill_per_run_override=0,
                    refresh_external_links=False,
                    enrich_japanese_names=False,
                )
                self.root.after(0, lambda: self.finish_update("빠른 최신 갱신이 완료되었습니다."))
                return

            if mode == "backfill_year":
                refresh_all_main(
                    progress_callback=self.set_progress,
                    include_forward=False,
                    backfill_per_run_override=4,
                    link_refresh_limit_override=320,
                )
                self.root.after(0, lambda: self.finish_update("과거 1년치 추가 수집이 완료되었습니다."))
                return

            refresh_all_main(
                progress_callback=self.set_progress,
                include_forward=True,
                backfill_per_run_override=0,
            )
            if mode == "update_and_viewer":
                self.set_progress("최신 시즌 풀 재동기화가 완료되었습니다.", "갱신된 DB로 뷰어를 여는 중입니다.")
                launch_viewer_process()
                self.root.after(0, self.finish_viewer_launch)
                return
            self.root.after(0, lambda: self.finish_update("최신 시즌 풀 재동기화가 완료되었습니다."))
        except Exception as exc:
            self.root.after(0, lambda: self.show_error(exc))

    def finish_update(self, message: str) -> None:
        self.set_busy(False)
        self._apply_progress(message, "현재 DB 상태와 백필 범위를 다시 읽어왔습니다.")
        messagebox.showinfo("완료", message)

    def finish_viewer_launch(self) -> None:
        self.set_busy(False)
        self._apply_progress("뷰어를 실행했습니다.", "브라우저에서 방영표를 확인해 주세요.")
        self.root.after(300, self.root.destroy)

    def show_error(self, exc: Exception) -> None:
        self.set_busy(False)
        message = str(exc).strip() or "알 수 없는 오류가 발생했습니다. 터미널 로그를 확인해 주세요."
        self._apply_progress("작업 중 오류가 발생했습니다.", message)
        messagebox.showerror("오류", message)


def main() -> None:
    root = tk.Tk()
    LauncherApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
