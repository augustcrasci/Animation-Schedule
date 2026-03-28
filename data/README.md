# 데이터 메모

## 기준 파일
- `anime_schedule.json`: 사람이 편집하는 원본 데이터
- `anime_schedule.schema.json`: 원본 데이터 검증용 JSON Schema
- `anime_schedule_compiled.json`: 웹 UI 전용 정규화 결과

## 원본 데이터 설계 의도
- `titles.ja`: 메인 표기용 일본어 제목
- `titles.en`: 서브 표기용 영문 제목
- `titles.ko`: 나중에 채워도 되는 선택 필드
- `schedule.reference`: 현재는 `jp_fastest` 고정
- `schedule.date`: 일본 기준 방영일
- `schedule.time`: 일본 편성표 표시 시간. `25:30` 같은 표기도 허용
- `schedule.sort_at`: 정렬용 실제 시각 ISO 문자열
- `availability.kr_streaming`: `true`, `false`, `null` 허용

## MAL 필드 대응 예시
- MAL 제목 -> `titles.*`
- MAL 방영 요일 / 시간 -> `schedule.*`
- MAL Information / Available At -> `source_links.*`
- 한국 스트리밍 여부 -> 초기에는 `availability`에 비워 두고 후속 소스로 확장
