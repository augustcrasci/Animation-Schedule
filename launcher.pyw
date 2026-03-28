from __future__ import annotations

import subprocess
import sys
import threading
import tkinter as tk
from pathlib import Path
from tkinter import messagebox

from app.calendar_common import PID_FILE, ROOT_DIR
from app.refresh_all import main as refresh_all_main


MODE_LABELS = {
    "update": "데이터 업데이트",
    "backfill_year": "과거 1년 백필",
    "viewer": "뷰어 실행",
    "update_and_viewer": "업데이트 후 뷰어 실행",
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


class LauncherApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("애니메이션 캘린더")
        self.root.resizable(False, False)
        self.root.configure(bg="#fff7ed")
        self.status_var = tk.StringVar(value="실행할 작업을 선택해 주세요.")
        self.detail_var = tk.StringVar(value="라이브 업데이트와 과거 백필을 분리한 로컬 수집기입니다.")
        self.buttons: list[tk.Button] = []

        frame = tk.Frame(root, bg="#fffdf8", padx=18, pady=18, bd=1, relief="solid")
        frame.pack(padx=18, pady=18)

        tk.Label(frame, text="애니메이션 캘린더", font=("Malgun Gothic", 13, "bold"), bg="#fffdf8", fg="#172033").pack(anchor="w")
        tk.Label(
            frame,
            text="일본 최속 방영표와 과거 시즌 백필을 로컬에서 관리합니다.",
            font=("Malgun Gothic", 9),
            bg="#fffdf8",
            fg="#6b7280",
        ).pack(anchor="w", pady=(4, 14))

        self.buttons.append(self._make_button(frame, "데이터 업데이트만", lambda: self.start("update")))
        self.buttons.append(self._make_button(frame, "과거 1년 백필", lambda: self.start("backfill_year")))
        self.buttons.append(self._make_button(frame, "뷰어만 실행", lambda: self.start("viewer")))
        self.buttons.append(self._make_button(frame, "업데이트 후 뷰어", lambda: self.start("update_and_viewer")))

        tk.Label(
            frame,
            textvariable=self.status_var,
            justify="left",
            wraplength=320,
            font=("Malgun Gothic", 9, "bold"),
            bg="#fffdf8",
            fg="#374151",
        ).pack(anchor="w", pady=(14, 2))
        tk.Label(
            frame,
            textvariable=self.detail_var,
            justify="left",
            wraplength=320,
            font=("Malgun Gothic", 9),
            bg="#fffdf8",
            fg="#6b7280",
        ).pack(anchor="w")

    def _make_button(self, parent: tk.Widget, text: str, command) -> tk.Button:
        button = tk.Button(
            parent,
            text=text,
            command=command,
            width=24,
            pady=6,
            bg="#172033",
            fg="#ffffff",
            activebackground="#314158",
            activeforeground="#ffffff",
            relief="flat",
            cursor="hand2",
            font=("Malgun Gothic", 10, "bold"),
        )
        button.pack(fill="x", pady=4)
        return button

    def set_busy(self, busy: bool) -> None:
        state = tk.DISABLED if busy else tk.NORMAL
        for button in self.buttons:
            button.configure(state=state)

    def set_progress(self, message: str, detail: str = "") -> None:
        self.root.after(0, lambda: self._apply_progress(message, detail))

    def _apply_progress(self, message: str, detail: str) -> None:
        self.status_var.set(message)
        self.detail_var.set(detail)

    def start(self, mode: str) -> None:
        self.set_busy(True)
        self._apply_progress(f"{MODE_LABELS[mode]} 중입니다.", "잠시만 기다려 주세요.")
        threading.Thread(target=self.run_mode, args=(mode,), daemon=True).start()

    def run_mode(self, mode: str) -> None:
        try:
            if mode == "viewer":
                self.set_progress("뷰어를 실행하는 중입니다.", "브라우저를 여는 중입니다.")
                launch_viewer_process()
                self.root.after(0, self.finish_viewer_launch)
                return

            if mode == "backfill_year":
                refresh_all_main(progress_callback=self.set_progress, include_forward=False, backfill_per_run_override=4, link_refresh_limit_override=320)
                self.root.after(0, self.finish_update)
                return

            refresh_all_main(progress_callback=self.set_progress)
            if mode == "update_and_viewer":
                self.set_progress("데이터 빌드가 완료되었습니다.", "브라우저를 여는 중입니다.")
                launch_viewer_process()
                self.root.after(0, self.finish_viewer_launch)
                return
            self.root.after(0, self.finish_update)
        except Exception as exc:
            self.root.after(0, lambda: self.show_error(exc))

    def finish_update(self) -> None:
        self.set_busy(False)
        self._apply_progress("데이터 업데이트가 완료되었습니다.", "compiled JSON과 변경 요약이 저장되었습니다.")
        messagebox.showinfo("완료", "데이터 업데이트가 완료되었습니다.")

    def finish_viewer_launch(self) -> None:
        self._apply_progress("뷰어를 실행했습니다.", "브라우저에서 방영표를 확인해 주세요.")
        self.root.after(300, self.root.destroy)

    def show_error(self, exc: Exception) -> None:
        self.set_busy(False)
        self._apply_progress("작업 중 오류가 발생했습니다.", str(exc))
        messagebox.showerror("오류", str(exc))


def main() -> None:
    root = tk.Tk()
    LauncherApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
