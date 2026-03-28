# 애니메이션 캘린더

일본 최속 방영 기준으로 정리하는 애니메이션 스케줄러입니다.

작품 DB보다는 "이번 주에 무엇이 언제 방영되는가"를 빠르게 보는 데 초점을 두고 있습니다.  
현재는 요일별 방영표, 리스트형 보기, 완결작 라이브러리, 극장판 일정, 좋아요, 검색 기능을 중심으로 구성되어 있습니다.

## 주요 기능
- 일본 최속 기준 방영일 / 방영 시간 정리
- 일본어 제목 메인, 영문 제목 서브 표시
- 요일별 방영표와 리스트형 보기
- 방영중 / 방영예정 / 완결작 / 극장판 분리
- 작품 좋아요, 인물 좋아요, 검색, 필터
- 작품 상세 정보에서 공식 홈페이지, 스태프, 캐스트 확인

## 데이터
- 기본 소스: MyAnimeList API v2
- 보조 소스: MAL HTML fallback
- 빌드 결과:
  - `data/anime_schedule.json`
  - `data/anime_schedule_compiled.json`

## 실행
```powershell
python -m app.refresh_all
python -m app.run_mode viewer
```

또는 `launcher.pyw`를 실행해서 갱신과 뷰어 실행을 사용할 수 있습니다.

## 폴더 구조
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
- `.env`는 커밋하지 않습니다.
- 과거 시즌 백필과 라이브 업데이트는 분리해서 관리합니다.
- 공식 홈페이지 링크를 우선 저장하고, X 링크는 있는 경우에만 추가합니다.
