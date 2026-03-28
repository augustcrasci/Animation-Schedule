# 애니메이션 캘린더

일본 최속 방영 기준으로 정리하는 애니메이션 스케줄러입니다.

주간 방영표, 리스트형 보기, 완결작 라이브러리, 극장판 일정, 좋아요 작품/인물/회사 관리, 상세 정보 확인을 한 화면에서 다루는 형태를 목표로 합니다.

## 주요 기능
- 일본 최속 기준 방영일 / 방영 시간 정리
- 일본어 제목 메인, 영문 제목 서브 표시
- 주간 방영표 / 리스트 / 완결작 / 극장판 분리 보기
- 작품 좋아요, 캐스트/스태프 좋아요, 회사 좋아요
- 작품 상세 정보에서 공식 홈페이지, X, 스태프, 캐스트 확인
- MAL 기반 수집 + 로컬 JSON 빌드

## 데이터 소스
- 기본: MyAnimeList API v2
- 보조: MAL HTML fallback

빌드 결과:
- `data/anime_schedule.json`
- `data/anime_schedule_compiled.json`

## 실행
```powershell
python -m app.run_mode viewer
python -m app.run_mode update_fast
python -m app.run_mode update
python -m app.run_mode backfill_year
```

또는 `launcher.pyw`를 실행해서 버튼으로 사용할 수 있습니다.

실행 모드:
- `viewer`
  현재 저장된 DB로 뷰어만 엽니다.
- `update_fast`
  오늘 기준 이번 분기와 미래 분기만 빠르게 갱신합니다.
  링크 재보강, 일본어 이름 재보강은 건너뜁니다.
- `update`
  오늘 기준 이번 분기와 미래 분기만 풀 재동기화합니다.
  공식 링크와 일본어 이름 보강까지 포함합니다.
- `backfill_year`
  과거 시즌 4개를 추가 수집합니다.
  최신 시즌 갱신과는 별도입니다.

## MAL API 사용 방식
- DB 업데이트에는 `MAL_CLIENT_ID`가 필요합니다.
- 각 사용자가 직접 MAL에서 API 앱을 만들고 자기 `Client ID`를 `.env`에 넣는 방식을 전제로 합니다.
- 저장소에는 실제 키를 올리지 않고 `.env.example`만 포함합니다.
- `MAL_CLIENT_ID`가 없으면 뷰어는 사용할 수 있지만 DB 업데이트는 실행되지 않습니다.
- `Client Secret`은 현재 수집기에서 필요하지 않습니다.

## 설정
1. `.env.example`을 참고해서 `.env`를 만듭니다.
2. `MAL_CLIENT_ID`에 본인 키를 입력합니다.
3. 필요하면 수집 관련 옵션을 조정합니다.

주요 환경 변수:
- `MAL_CLIENT_ID`
- `ANIME_SYNC_START_YEAR`
- `ANIME_SYNC_START_SEASON`
- `ANIME_BACKFILL_PER_RUN`
- `ANIME_FETCH_CREDITS`
- `ANIME_VIEWER_PORT`

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

## 메모
- 최신 시즌 갱신과 과거 백필은 분리되어 있습니다.
- 공식 홈페이지 링크를 우선 저장하고, X 링크는 있는 경우만 추가합니다.
- 미래 작품은 날짜 확정 여부에 따라 메인 방영표와 예정작 영역을 나눠서 표시합니다.
