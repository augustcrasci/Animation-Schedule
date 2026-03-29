# 애니메이션 캘린더

일본 최속 방영 기준으로 애니메이션 일정을 정리해서 보는 로컬 스케줄러입니다.

주간 방영표, 리스트, 완결작 라이브러리, 극장판 일정, 작품/성우/스태프/회사 즐겨찾기, 상세 정보 모달을 한 화면에서 볼 수 있도록 구성되어 있습니다.

## 주요 기능
- 일본 최속 기준 방영일 / 방영 시간 표시
- 일본어 제목 메인, 영문 제목 서브 표시
- 요일별 방영표 / 리스트 / 완결작 / 극장판 보기
- 작품 좋아요, 성우/스태프 좋아요, 회사 좋아요
- 작품 상세 정보에서 공식 홈페이지, X, 스태프, 캐스트 확인
- 성우 / 스태프 / 회사별 관련 작품 모달
- MyAnimeList 기반 수집 + 로컬 JSON 빌드

## 데이터 소스
- 기본: MyAnimeList API v2
- 보조: MAL HTML fallback

생성되는 주요 파일:
- `data/anime_schedule.json`
- `data/anime_schedule_compiled.json`

## 실행 방법
실행기:
- `launcher.pyw`

직접 실행:
```powershell
python -m app.run_mode viewer
python -m app.run_mode update_fast
python -m app.run_mode update
python -m app.run_mode backfill_year
```

실행 모드:
- `viewer`
  현재 저장된 DB로 뷰어만 엽니다.
- `update_fast`
  이번 분기와 미래 분기를 빠르게 다시 확인합니다.
- `update`
  이번 분기와 미래 분기를 풀 재동기화합니다.
- `backfill_year`
  과거 시즌 1년치(4개 시즌)를 추가 수집합니다.

## MAL API 사용 방식
- DB 업데이트에는 `MAL_CLIENT_ID`가 필요합니다.
- 저장소에는 실제 키를 포함하지 않습니다.
- 각 사용자가 직접 MAL에서 API 앱을 만들고 자신의 `Client ID`를 입력하는 방식입니다.
- `MAL_CLIENT_ID`가 없으면 뷰어는 사용할 수 있지만 DB 업데이트는 실행되지 않습니다.
- 현재 수집기에는 `Client Secret`이 필요하지 않습니다.

설정 순서:
1. `.env.example`을 참고해 `.env`를 만듭니다.
2. `MAL_CLIENT_ID`를 입력합니다.
3. 필요하면 수집 관련 옵션을 조정합니다.

주요 환경 변수:
- `MAL_CLIENT_ID`
- `ANIME_SYNC_START_YEAR`
- `ANIME_SYNC_START_SEASON`
- `ANIME_BACKFILL_PER_RUN`
- `ANIME_FETCH_CREDITS`
- `ANIME_VIEWER_PORT`
- `MAL_REQUEST_INTERVAL_SECONDS`

## 프로젝트 구조
```text
app/
  fetch_seasons.py
  refresh_all.py
  run_mode.py
  viewer.py
data/
  anime_schedule.json
  anime_schedule_compiled.json
  anime_schedule.schema.json
  source_state.json
web/
  index.html
  app.js
  style.css
launcher.pyw
```

## 현재 정리 상태
- 최신 시즌 갱신과 과거 백필이 분리되어 있습니다.
- 과거 메타데이터 복구 로직이 별도로 정리되어 있습니다.
- 공식 홈페이지 링크를 우선 수집하고, X 링크는 있을 때만 추가합니다.
- 성우/스태프/회사 관련 작품 보기와 좋아요 연결이 들어가 있습니다.
- 미래 작품은 날짜 확정 여부에 따라 메인 방영표와 예정 영역을 나눠 표시합니다.
