from __future__ import annotations

import http.server
import os
import socketserver
import webbrowser

from app.calendar_common import PID_FILE, ROOT_DIR, get_env


DEFAULT_PORT = 8876


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format: str, *args) -> None:
        return


def main() -> None:
    port = int(get_env("ANIME_VIEWER_PORT", str(DEFAULT_PORT)) or DEFAULT_PORT)
    url = f"http://localhost:{port}/web/index.html"

    try:
        with ReusableTCPServer(("", port), NoCacheHandler) as server:
            PID_FILE.write_text(str(os.getpid()), encoding="utf-8")
            print(f"Starting animation calendar server: {url}")
            webbrowser.open(url)

            try:
                server.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")
            finally:
                if PID_FILE.exists() and PID_FILE.read_text(encoding="utf-8").strip() == str(os.getpid()):
                    PID_FILE.unlink(missing_ok=True)
    except OSError as exc:
        if getattr(exc, "winerror", None) == 10048:
            webbrowser.open(url)
            return
        raise


if __name__ == "__main__":
    main()
