const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS = {
  ko: { ALL: "전체", MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" },
  en: { ALL: "All", MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun" },
};
const DAY_KANJI = { MON: "月", TUE: "火", WED: "水", THU: "木", FRI: "金", SAT: "土", SUN: "日" };
const DAY_SHORT_EN = { MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun" };
const SEASON_LABELS = {
  ko: { WINTER: "겨울", SPRING: "봄", SUMMER: "여름", FALL: "가을" },
  en: { WINTER: "Winter", SPRING: "Spring", SUMMER: "Summer", FALL: "Fall" },
};
const SEASON_SHORT = { WINTER: "Win", SPRING: "Spr", SUMMER: "Sum", FALL: "Fal" };
const SEASON_RANK = { WINTER: 1, SPRING: 2, SUMMER: 3, FALL: 4 };
const SEASON_FILTER_ORDER = ["ALL", "WINTER", "SPRING", "SUMMER", "FALL"];
const MEDIA_PRIORITY = { tv: 0, ona: 1, ova: 2, special: 3, movie: 4 };
const MEDIA_FILTER_ORDER = ["ALL", "TV", "ONA", "OVA", "MOVIE"];
const FINISHED_STATUSES = new Set(["finished_airing", "ended"]);
const VIEW_STORAGE_KEY = "anime_calendar_view";
const FAVORITES_STORAGE_KEY = "anime_calendar_favorites";
const PERSON_FAVORITES_STORAGE_KEY = "anime_calendar_person_favorites";
const STUDIO_FAVORITES_STORAGE_KEY = "anime_calendar_studio_favorites";
const FAVORITE_SCOPE_ORDER = ["TITLE", "CAST", "STAFF", "STUDIO"];
const LANG_STORAGE_KEY = "anime_calendar_lang";
const THEME_STORAGE_KEY = "anime_calendar_theme";
const UI_STATE_STORAGE_KEY = "anime_calendar_ui_state";
const DEFAULT_RELATION_WORK_LIMIT = 12;
const RELATION_WORK_INCREMENT = 12;

const TEXT = {
  ko: {
    heroEyebrow: "애니메이션 캘린더",
    heroTitle: "일본 최속 방영표",
    heroText: "주간 방영표, 완결작 라이브러리, 극장판 개봉 일정을 한 화면에서 다루는 애니메이션 스케줄러입니다.",
    sourceMeta: "데이터 소스",
    buildMeta: "마지막 DB 업데이트",
    liveMeta: "라이브 동기화",
    backfillMeta: "과거 백필 범위",
    activeMeta: "현재 방영작",
    finishedMeta: "완결작 DB",
    metaStatus: "DB 업데이트",
    searchLabel: "검색",
    searchPlaceholder: "제목, 스태프, 제작사 등 검색",
    favoritesOnly: "좋아요만 보기",
    favoriteScopeTitle: "작품",
    favoriteScopeCast: "캐스트",
    favoriteScopeStaff: "스태프",
    favoriteScopeStudio: "회사",
    yearFilter: "연도",
    allYears: "전체 연도",
    mediaAll: "전체 타입",
    mediaTv: "TVA",
    mediaOna: "ONA",
    mediaOva: "OVA",
    mediaMovie: "극장판",
    themeLight: "라이트",
    themeDark: "다크",
    favorites: "좋아요",
    favoritesTitle: "좋아요 작품",
    favoritePeopleTitle: "좋아요 인물",
    close: "닫기",
    board: "요일별 방영표",
    list: "리스트",
    moviesView: "극장판",
    movieNow: "상영중",
    movieUpcoming: "상영예정",
    statusAiring: "방영중",
    statusUpcoming: "방영예정",
    finishedView: "완결작",
    visibleActive: "표시 중 방영작",
    visibleMovies: "표시 중 극장판",
    favoriteCount: "좋아요 수",
    finishedMatches: "표시 중 완결작",
    newestSeason: "최신 분기 표시 수",
    noActive: "조건에 맞는 현재 방영작이 없습니다.",
    noActiveDay: "이 요일에는 현재 방영작이 없습니다.",
    noFinished: "조건에 맞는 완결작이 없습니다.",
    noSearch: "검색 결과가 없습니다.",
    noMovies: "조건에 맞는 극장판이 없습니다.",
    noFavorites: "좋아요한 작품이 없습니다.",
    noFavoritePeople: "좋아요한 인물이 없습니다.",
    finishedSearchTitle: "완결작 목록",
    searchResultsTitle: "전체 DB 검색 결과",
    movieNowTitle: "상영중 극장판",
    movieUpcomingTitle: "상영예정 극장판",
    release: "개봉",
    official: "공식",
    x: "X",
    airing: "방영중",
    upcoming: "방영예정",
    finished: "완결",
    unknown: "미정",
    scheduleConfirmed: "방영일 확정",
    scheduleSeasonal: "분기 예정",
    scheduleTentative: "상세 미정",
    upcomingSeasonalTitle: "분기 예정작",
    upcomingSeasonalText: "정확한 방영일이나 시간이 아직 공개되지 않은 작품입니다.",
    episodes: "총 화수",
    plannedEpisodes: "기획 화수",
    synopsis: "시놉시스",
    staff: "스태프",
    cast: "캐릭터 / 성우",
    noStaff: "스태프 정보가 아직 없습니다.",
    noCast: "캐릭터 / 성우 정보가 아직 없습니다.",
    noSynopsis: "시놉시스 정보가 아직 없습니다.",
    broadcast: "방송",
    date: "날짜",
    season: "시즌",
    seasonAll: "전체 분기",
    source: "원작",
    studios: "제작",
    score: "평점",
    rank: "랭크",
    popularity: "인기",
    detailsKicker: "애니메이션 상세",
    loading: "불러오는 중...",
  },
  en: {
    heroEyebrow: "Animation Calendar",
    heroTitle: "JP Fastest Schedule Board",
    heroText: "A compact anime scheduler covering weekly broadcasts, finished-library browsing, and movie release dates.",
    sourceMeta: "Source",
    buildMeta: "Last DB Update",
    liveMeta: "Live Sync",
    backfillMeta: "Backfill Through",
    activeMeta: "Active Titles",
    finishedMeta: "Finished Library",
    metaStatus: "DB Status",
    searchLabel: "Search",
    searchPlaceholder: "Search titles, staff, studios...",
    favoritesOnly: "Favorites only",
    favoriteScopeTitle: "Titles",
    favoriteScopeCast: "Cast",
    favoriteScopeStaff: "Staff",
    favoriteScopeStudio: "Studios",
    yearFilter: "Year",
    allYears: "All Years",
    mediaAll: "All Types",
    mediaTv: "TVA",
    mediaOna: "ONA",
    mediaOva: "OVA",
    mediaMovie: "Movie",
    themeLight: "Light",
    themeDark: "Dark",
    favorites: "Favorites",
    favoritesTitle: "Favorite Titles",
    favoritePeopleTitle: "Favorite People",
    close: "Close",
    board: "Weekday Board",
    list: "List",
    moviesView: "Movies",
    movieNow: "Now Showing",
    movieUpcoming: "Upcoming",
    statusAiring: "Airing",
    statusUpcoming: "Upcoming",
    finishedView: "Finished",
    visibleActive: "Visible Active",
    visibleMovies: "Visible Movies",
    favoriteCount: "Favorites",
    finishedMatches: "Visible Finished",
    newestSeason: "Newest Season",
    noActive: "No active titles match the current filters.",
    noActiveDay: "No active title on this day.",
    noFinished: "No finished titles match the current filters.",
    noSearch: "No search results.",
    noMovies: "No movies match the current filters.",
    noFavorites: "No favorite titles yet.",
    noFavoritePeople: "No favorite people yet.",
    finishedSearchTitle: "Finished Library",
    searchResultsTitle: "Search Results",
    movieNowTitle: "Now Showing Movies",
    movieUpcomingTitle: "Upcoming Movies",
    release: "Release",
    official: "Official",
    x: "X",
    airing: "Airing",
    upcoming: "Upcoming",
    finished: "Finished",
    unknown: "Unknown",
    scheduleConfirmed: "Confirmed",
    scheduleSeasonal: "Seasonal",
    scheduleTentative: "Tentative",
    upcomingSeasonalTitle: "Seasonal Upcoming",
    upcomingSeasonalText: "Titles announced for a season without a stable date or time yet.",
    episodes: "Episodes",
    plannedEpisodes: "Planned Episodes",
    synopsis: "Synopsis",
    staff: "Staff",
    cast: "Characters / Voice Actors",
    noStaff: "Staff info is not synced yet.",
    noCast: "Character / voice actor info is not synced yet.",
    noSynopsis: "No synopsis synced yet.",
    broadcast: "Broadcast",
    date: "Date",
    season: "Season",
    seasonAll: "All Seasons",
    source: "Source",
    studios: "Studios",
    score: "Score",
    rank: "Rank",
    popularity: "Popularity",
    detailsKicker: "Anime Detail",
    loading: "Loading...",
  },
};

function loadUiState() {
  try {
    return JSON.parse(localStorage.getItem(UI_STATE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

const savedUiState = loadUiState();

function normalizeSelectedMedia(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => MEDIA_FILTER_ORDER.includes(item) && item !== "ALL");
  }
  if (typeof value === "string" && MEDIA_FILTER_ORDER.includes(value) && value !== "ALL") {
    return [value];
  }
  return [];
}

function normalizeFavoriteScopes(value) {
  if (!Array.isArray(value)) {
    return [...FAVORITE_SCOPE_ORDER];
  }
  const normalized = value.filter((item) => FAVORITE_SCOPE_ORDER.includes(item));
  return normalized.length ? normalized : [...FAVORITE_SCOPE_ORDER];
}

const state = {
  dataset: null,
  entries: [],
  entryIndex: new Map(),
  peopleIndex: new Map(),
  personAliasIndex: new Map(),
  studioIndex: new Map(),
  currentDetailEntryId: null,
  currentRelation: null,
  viewMode: localStorage.getItem(VIEW_STORAGE_KEY) || "board",
  movieTab: savedUiState.movieTab || "now",
  scheduleStatus: savedUiState.scheduleStatus || "airing",
  selectedDay: savedUiState.selectedDay || "ALL",
  selectedYear: savedUiState.selectedYear || "ALL",
  selectedSeason: savedUiState.selectedSeason || "ALL",
  selectedMedia: normalizeSelectedMedia(savedUiState.selectedMedia),
  selectedFavoriteScopes: normalizeFavoriteScopes(savedUiState.selectedFavoriteScopes),
  search: savedUiState.search || "",
  searchDraft: savedUiState.search || "",
  favoritesOnly: Boolean(savedUiState.favoritesOnly),
  activeCount: 0,
  finishedCount: 0,
  lang: localStorage.getItem(LANG_STORAGE_KEY) || "ko",
  theme: localStorage.getItem(THEME_STORAGE_KEY) || "light",
};

let modalStackCounter = 30;
let searchCommitTimer = null;
let searchComposing = false;

function canonicalPersonId(personId) {
  const rawId = String(personId || "").trim();
  if (!rawId) {
    return "";
  }
  return state.personAliasIndex.get(rawId) || rawId;
}

function normalizePersonName(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function personMergeKey(person) {
  const ja = normalizePersonName(person.name_ja);
  if (ja) {
    return `ja:${ja}`;
  }
  const en = normalizePersonName(person.name).replaceAll(",", "");
  if (en) {
    return `en:${en}`;
  }
  return `id:${String(person.id || "").trim()}`;
}

function choosePreferredText(currentValue, candidateValue) {
  const current = String(currentValue || "").trim();
  const candidate = String(candidateValue || "").trim();
  if (!current) {
    return candidate;
  }
  if (!candidate) {
    return current;
  }
  if (candidate.length > current.length) {
    return candidate;
  }
  return current;
}

function personIdPriority(personId) {
  const value = String(personId || "").trim();
  if (/^\d+$/.test(value)) {
    return 0;
  }
  if (value && !value.startsWith("ani-person-")) {
    return 1;
  }
  return 2;
}

function mergePersonRoleLists(targetRoles, sourceRoles) {
  const merged = new Map();
  [...(targetRoles || []), ...(sourceRoles || [])].forEach((item) => {
    const key = [
      item.kind || "",
      item.entry_id || "",
      item.role || "",
      item.character_id || "",
      item.character_name_ja || "",
      item.character_name || "",
      item.name_ja || "",
      item.name || "",
    ].join("|");
    if (!merged.has(key)) {
      merged.set(key, item);
    }
  });
  return [...merged.values()];
}

function mergePeopleIndex(rawPeople) {
  const grouped = new Map();

  (rawPeople || []).forEach((person) => {
    const rawId = String(person.id || "").trim();
    if (!rawId) {
      return;
    }
    const key = personMergeKey(person);

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: rawId,
        aliases: new Set([rawId]),
        name: String(person.name || "").trim(),
        name_ja: String(person.name_ja || "").trim(),
        entry_ids: [...new Set(person.entry_ids || [])],
        roles: [...(person.roles || [])],
      });
      return;
    }

    const merged = grouped.get(key);
    merged.aliases.add(rawId);
    if (personIdPriority(rawId) < personIdPriority(merged.id)) {
      merged.id = rawId;
    }
    merged.name = choosePreferredText(merged.name, person.name);
    merged.name_ja = choosePreferredText(merged.name_ja, person.name_ja);
    merged.entry_ids = [...new Set([...(merged.entry_ids || []), ...(person.entry_ids || [])])];
    merged.roles = mergePersonRoleLists(merged.roles, person.roles);
  });

  const peopleMap = new Map();
  const aliasMap = new Map();
  [...grouped.values()].forEach((person) => {
    const merged = {
      id: person.id,
      name: person.name,
      name_ja: person.name_ja,
      entry_ids: [...new Set(person.entry_ids || [])],
      roles: mergePersonRoleLists([], person.roles),
      aliases: [...person.aliases],
    };
    peopleMap.set(String(merged.id), merged);
    merged.aliases.forEach((aliasId) => {
      aliasMap.set(String(aliasId), String(merged.id));
    });
  });

  return { peopleMap, aliasMap };
}

function migratePersonFavoritesStorage() {
  let rawFavorites = [];
  try {
    rawFavorites = JSON.parse(localStorage.getItem(PERSON_FAVORITES_STORAGE_KEY) || "[]");
  } catch {
    rawFavorites = [];
  }
  const normalized = [...new Set(rawFavorites.map((personId) => canonicalPersonId(personId)).filter(Boolean))];
  if (JSON.stringify(rawFavorites) !== JSON.stringify(normalized)) {
    localStorage.setItem(PERSON_FAVORITES_STORAGE_KEY, JSON.stringify(normalized));
  }
}

function persistUiState() {
  localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify({
    movieTab: state.movieTab,
    scheduleStatus: state.scheduleStatus,
    selectedDay: state.selectedDay,
    selectedYear: state.selectedYear,
    selectedSeason: state.selectedSeason,
    selectedMedia: state.selectedMedia,
    selectedFavoriteScopes: state.selectedFavoriteScopes,
    search: state.search,
    favoritesOnly: state.favoritesOnly,
  }));
}

function clearSearchCommitTimer() {
  if (!searchCommitTimer) {
    return;
  }
  clearTimeout(searchCommitTimer);
  searchCommitTimer = null;
}

function commitSearchDraft() {
  clearSearchCommitTimer();
  const nextSearch = String(state.searchDraft || "").trim();
  if (state.search === nextSearch) {
    return;
  }
  state.search = nextSearch;
  render();
}

function queueSearchCommit() {
  clearSearchCommitTimer();
  searchCommitTimer = setTimeout(() => {
    searchCommitTimer = null;
    if (searchComposing) {
      return;
    }
    commitSearchDraft();
  }, 320);
}

function t(key) {
  return TEXT[state.lang][key] || key;
}

function dayLabel(day) {
  return DAY_LABELS[state.lang][day] || day;
}

function dayHeading(day) {
  const label = dayLabel(day);
  if (state.lang !== "ko" || day === "ALL") {
    return escapeHtml(label);
  }
  return `<span class="day-main">${escapeHtml(label)}</span><small class="day-sub">${escapeHtml(DAY_KANJI[day] || "")}</small>`;
}

function dayClass(day) {
  return `day-${String(day || "").toLowerCase()}`;
}

function seasonFilterLabel(season) {
  if (season === "ALL") {
    return t("seasonAll");
  }
  return SEASON_LABELS[state.lang][season] || season;
}

function mediaFilterLabel(media) {
  if (media === "ALL") {
    return t("mediaAll");
  }
  if (media === "TV") {
    return t("mediaTv");
  }
  if (media === "ONA") {
    return t("mediaOna");
  }
  if (media === "OVA") {
    return t("mediaOva");
  }
  if (media === "MOVIE") {
    return t("mediaMovie");
  }
  return media;
}

function dayShortEn(day) {
  return DAY_SHORT_EN[day] || day || "-";
}

function formatCount(value) {
  return state.lang === "ko" ? `${value}작` : `${value} titles`;
}

function formatEntryCount(value) {
  return state.lang === "ko" ? `${value}편` : `${value} titles`;
}

function activeMetaNote() {
  return state.lang === "ko" ? "주간 방영표 기준 표시 작품 수" : "Visible on the weekly schedule";
}

function finishedMetaNote() {
  const totalFinishedEntries = state.entries.filter((entry) => entry.finished).length;
  const oldestSeason = formatCollectorSeason(state.dataset?.collector_status?.oldest_completed_season);
  if (oldestSeason === "-") {
    return state.lang === "ko"
      ? `영화 포함 완결 엔트리 ${formatEntryCount(totalFinishedEntries)}`
      : `${formatEntryCount(totalFinishedEntries)} finished incl. movies`;
  }
  return state.lang === "ko"
    ? `영화 포함 ${formatEntryCount(totalFinishedEntries)} | ${oldestSeason}까지 수집`
    : `${formatEntryCount(totalFinishedEntries)} incl. movies | through ${oldestSeason}`;
}

function metaStatusSubtext() {
  const nextBackfill = formatCollectorSeason(state.dataset?.collector_status?.next_backfill);
  if (nextBackfill === "-") {
    return state.lang === "ko" ? "다음 백필 목표가 없습니다." : "No next backfill target.";
  }
  return state.lang === "ko" ? `다음 과거 백필: ${nextBackfill}` : `Next backfill: ${nextBackfill}`;
}

function favoriteScopeLabel(scope) {
  if (scope === "TITLE") {
    return t("favoriteScopeTitle");
  }
  if (scope === "CAST") {
    return t("favoriteScopeCast");
  }
  if (scope === "STAFF") {
    return t("favoriteScopeStaff");
  }
  if (scope === "STUDIO") {
    return t("favoriteScopeStudio");
  }
  return scope;
}

function relationWorkLimit(type, id) {
  if (
    state.currentRelation
    && state.currentRelation.type === type
    && String(state.currentRelation.id) === String(id)
    && Number.isFinite(state.currentRelation.visibleWorkCount)
  ) {
    return state.currentRelation.visibleWorkCount;
  }
  return DEFAULT_RELATION_WORK_LIMIT;
}

function renderRelationMoreButton(type, id, visibleCount, totalCount) {
  if (totalCount <= visibleCount) {
    return "";
  }
  const nextCount = Math.min(totalCount, visibleCount + RELATION_WORK_INCREMENT);
  const label = state.lang === "ko"
    ? `더보기 ${nextCount}/${totalCount}`
    : `Show more ${nextCount}/${totalCount}`;
  return `
    <div class="relation-more-row">
      <button class="ghost-btn relation-more-btn" type="button" data-relation-type="${escapeHtml(type)}" data-relation-more-works="${escapeHtml(String(id))}">
        ${escapeHtml(label)}
      </button>
    </div>
  `;
}

function favoriteScopeMatches(info) {
  return state.selectedFavoriteScopes.some((scope) => {
    if (scope === "TITLE") {
      return info.title;
    }
    if (scope === "CAST") {
      return info.cast.length > 0;
    }
    if (scope === "STAFF") {
      return info.staff.length > 0;
    }
    if (scope === "STUDIO") {
      return info.studios.length > 0;
    }
    return false;
  });
}

function mediaPriority(entry) {
  const mediaType = String(entry.extensions?.media_type || entry.entity_type || "").toLowerCase();
  return MEDIA_PRIORITY[mediaType] ?? 9;
}

function getFavoriteSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveFavoriteSet(set) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...set]));
}

function getPersonFavoriteSet() {
  try {
    return new Set(
      JSON.parse(localStorage.getItem(PERSON_FAVORITES_STORAGE_KEY) || "[]")
        .map((personId) => canonicalPersonId(personId))
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

function savePersonFavoriteSet(set) {
  localStorage.setItem(PERSON_FAVORITES_STORAGE_KEY, JSON.stringify([...set]));
}

function getStudioFavoriteSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STUDIO_FAVORITES_STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveStudioFavoriteSet(set) {
  localStorage.setItem(STUDIO_FAVORITES_STORAGE_KEY, JSON.stringify([...set]));
}

function buildStudioIndex(entries) {
  const index = new Map();
  entries.forEach((entry) => {
    (entry.extensions?.studios || []).forEach((studioName) => {
      const name = String(studioName || "").trim();
      if (!name) {
        return;
      }
      if (!index.has(name)) {
        index.set(name, { id: name, name, entry_ids: [] });
      }
      const studio = index.get(name);
      if (!studio.entry_ids.includes(entry.id)) {
        studio.entry_ids.push(entry.id);
      }
    });
  });
  return index;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatGeneratedAt(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return new Intl.DateTimeFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function formatCollectorSeason(value) {
  if (!value || !value.year || !value.quarter) {
    return "-";
  }
  const quarterKey = String(value.quarter || "").toUpperCase();
  const quarter = SEASON_LABELS[state.lang][quarterKey] || quarterKey;
  return `${value.year} ${quarter}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return "-";
  }
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${year.slice(2)}.${Number(month)}.${Number(day)}`;
}

function formatDisplayTime(value) {
  return !value || value === "99:99" ? "-" : value;
}

function isUnknownTime(entry) {
  return !entry.schedule?.time || entry.schedule.time === "99:99";
}

function isFinished(entry) {
  return FINISHED_STATUSES.has(String(entry.status || "").toLowerCase());
}

function isMovie(entry) {
  return String(entry.extensions?.media_type || entry.entity_type || "").toLowerCase() === "movie";
}

function seasonSortValue(entry) {
  const season = entry.season || {};
  return (Number(season.year) || 0) * 10 + (SEASON_RANK[String(season.quarter || "").toUpperCase()] || 0);
}

function statusPriority(entry) {
  const value = String(entry.status || "").toLowerCase();
  if (value === "currently_airing" || value === "airing") {
    return 0;
  }
  if (value === "not_yet_aired" || value === "upcoming") {
    return 1;
  }
  return 2;
}

function formatStatus(entry) {
  const value = String(entry.status || "").toLowerCase();
  if (value === "currently_airing" || value === "airing") {
    return t("airing");
  }
  if (value === "not_yet_aired" || value === "upcoming") {
    return t("upcoming");
  }
  if (value === "finished_airing" || value === "ended") {
    return t("finished");
  }
  return t("unknown");
}

function formatMediaType(entry) {
  return String(entry.extensions?.media_type || entry.entity_type || "").toUpperCase() || "-";
}

function formatSeason(entry) {
  const year = entry.season?.year;
  const quarterKey = String(entry.season?.quarter || "").toUpperCase();
  const quarter = SEASON_LABELS[state.lang][quarterKey] || quarterKey || "-";
  return year ? `${year} ${quarter}` : quarter;
}

function formatSeasonCompact(entry) {
  return formatSeason(entry);
}

function formatSeasonShort(entry) {
  const year = entry.season?.year;
  const quarterKey = String(entry.season?.quarter || "").toUpperCase();
  const quarter = SEASON_SHORT[quarterKey];
  if (!year || !quarter) {
    return "-";
  }
  return `${String(year).slice(2)}.${quarter}`;
}

function currentEpisodeLabel(entry) {
  const currentEpisode = entry.extensions?.episode_meta?.latest_broadcast_episode;
  if (!currentEpisode) {
    return "";
  }
  return state.lang === "ko" ? `#${currentEpisode}화` : `#${currentEpisode}`;
}

function totalEpisodeLabel(entry) {
  const totalEpisodes = entry.extensions?.episode_meta?.total_episodes;
  if (!totalEpisodes) {
    return "-";
  }
  return state.lang === "ko" ? `${totalEpisodes}화` : `${totalEpisodes} eps`;
}

function inferScheduleConfidence(entry) {
  const stored = String(entry.extensions?.schedule_meta?.schedule_confidence || "").trim().toLowerCase();
  if (stored === "confirmed" || stored === "seasonal" || stored === "tentative") {
    return stored;
  }

  const rawStartDate = String(entry.extensions?.schedule_meta?.raw_start_date || "").trim();
  const parts = rawStartDate ? rawStartDate.split("-").filter(Boolean) : [];
  if (parts.length >= 3) {
    return "confirmed";
  }
  if (parts.length > 0) {
    return "seasonal";
  }
  return statusPriority(entry) === 1 ? "tentative" : "confirmed";
}

function scheduleConfidenceLabel(entry) {
  const confidence = entry.schedule_confidence || inferScheduleConfidence(entry);
  if (confidence === "confirmed") {
    return t("scheduleConfirmed");
  }
  if (confidence === "seasonal") {
    return t("scheduleSeasonal");
  }
  return t("scheduleTentative");
}

function normalizeEntry(entry) {
  const schedule = entry.schedule || {};
  const titles = entry.titles || {};
  const availability = entry.availability || {};
  const weekday = schedule.day_of_week || "MON";
  const timeValue = schedule.time || "99:99";
  const [hours, minutes] = timeValue.split(":").map((item) => Number.parseInt(item, 10));

  return {
    ...entry,
    favorite_key: entry.favorite_key || entry.id,
    weekday_index: Number.isInteger(entry.weekday_index) ? entry.weekday_index : DAY_ORDER.indexOf(weekday),
    time_sort_value: timeValue === "99:99" ? Number.MAX_SAFE_INTEGER : hours * 60 + minutes,
    season_sort_value: seasonSortValue(entry),
    finished: isFinished(entry),
    schedule_confidence: inferScheduleConfidence(entry),
    search_text: entry.search_text || [
      entry.id,
      titles.ja,
      titles.en,
      titles.ko,
      titles.short,
      entry.season?.year,
      entry.season?.quarter,
      formatSeason(entry),
      formatSeasonShort(entry),
      entry.broadcasters?.network,
      entry.broadcasters?.block,
      ...(entry.tags || []),
      ...(entry.notes || []),
      ...((entry.extensions?.studios) || []),
      ...((entry.extensions?.credits?.staff || []).flatMap((item) => [item.name || "", item.name_ja || ""])),
      ...((entry.extensions?.credits?.characters || []).flatMap((item) => [item.character_name || "", item.character_name_ja || "", item.voice_actor_name || "", item.voice_actor_name_ja || ""])),
    ].filter(Boolean).join(" ").toLowerCase(),
    has_kr_streaming: typeof entry.has_kr_streaming === "boolean" ? entry.has_kr_streaming : availability.kr_streaming === true,
  };
}

function compareEntries(left, right) {
  if (statusPriority(left) !== statusPriority(right)) {
    return statusPriority(left) - statusPriority(right);
  }
  if (mediaPriority(left) !== mediaPriority(right)) {
    return mediaPriority(left) - mediaPriority(right);
  }
  if ((right.schedule?.date || "") !== (left.schedule?.date || "")) {
    return (right.schedule?.date || "").localeCompare(left.schedule?.date || "");
  }
  if (left.weekday_index !== right.weekday_index) {
    return left.weekday_index - right.weekday_index;
  }
  if (isUnknownTime(left) !== isUnknownTime(right)) {
    return isUnknownTime(left) ? 1 : -1;
  }
  if (left.time_sort_value !== right.time_sort_value) {
    return left.time_sort_value - right.time_sort_value;
  }
  if (left.season_sort_value !== right.season_sort_value) {
    return right.season_sort_value - left.season_sort_value;
  }
  return (left.titles?.ja || "").localeCompare(right.titles?.ja || "", "ja");
}

function compareFinishedEntries(left, right) {
  if (left.season_sort_value !== right.season_sort_value) {
    return right.season_sort_value - left.season_sort_value;
  }
  if ((right.extensions?.score || 0) !== (left.extensions?.score || 0)) {
    return (right.extensions?.score || 0) - (left.extensions?.score || 0);
  }
  if ((right.extensions?.popularity || 0) !== (left.extensions?.popularity || 0)) {
    return (left.extensions?.popularity || 0) - (right.extensions?.popularity || 0);
  }
  return (left.titles?.ja || "").localeCompare(right.titles?.ja || "", "ja");
}

function compareMovieEntries(left, right) {
  if (statusPriority(left) !== statusPriority(right)) {
    return statusPriority(left) - statusPriority(right);
  }
  if ((right.schedule?.date || "") !== (left.schedule?.date || "")) {
    return (right.schedule?.date || "").localeCompare(left.schedule?.date || "");
  }
  if (isUnknownTime(left) !== isUnknownTime(right)) {
    return isUnknownTime(left) ? 1 : -1;
  }
  if (left.time_sort_value !== right.time_sort_value) {
    return left.time_sort_value - right.time_sort_value;
  }
  return (left.titles?.ja || "").localeCompare(right.titles?.ja || "", "ja");
}

async function loadData() {
  const candidates = [
    "../data/anime_schedule_compiled.json",
    "../data/anime_schedule.json",
  ];

  let payload = null;
  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      payload = await response.json();
      break;
    } catch {
      continue;
    }
  }

  if (!payload) {
    renderFatal("Could not load dataset.");
    return;
  }

  state.dataset = payload;
  state.entries = (payload.entries || []).map(normalizeEntry).sort(compareEntries);
  state.entryIndex = new Map(state.entries.map((entry) => [entry.id, entry]));
  const mergedPeople = mergePeopleIndex((((payload.indexes || {}).people) || []));
  state.peopleIndex = mergedPeople.peopleMap;
  state.personAliasIndex = mergedPeople.aliasMap;
  migratePersonFavoritesStorage();
  state.studioIndex = buildStudioIndex(state.entries);
  state.activeCount = state.entries.filter((entry) => statusPriority(entry) === 0 && !isMovie(entry)).length;
  state.finishedCount = state.entries.filter((entry) => entry.finished).length;
  render();
}

function matchesBaseFilters(entry, favorites, options = {}) {
  const showScheduleTabs = state.viewMode === "board" || state.viewMode === "list";
  const applyYearFilter = state.viewMode === "finished";
  const applySeasonFilter = state.viewMode === "finished" || (showScheduleTabs && state.scheduleStatus === "upcoming");
  const applyMediaFilter = state.viewMode !== "movies";
  if (state.selectedDay !== "ALL" && entry.schedule.day_of_week !== state.selectedDay) {
    if (!options.ignoreDayFilter) {
      return false;
    }
  }
  if (state.favoritesOnly) {
    const favoriteInfo = options.favoriteInfo || getFavoriteRelationInfo(entry, favorites, options.personFavorites, options.studioFavorites);
    if (!favoriteScopeMatches(favoriteInfo)) {
      return false;
    }
  }
  if (applyYearFilter && state.selectedYear !== "ALL" && String(entry.season?.year || "") !== state.selectedYear) {
    return false;
  }
  if (applySeasonFilter && state.selectedSeason !== "ALL" && String(entry.season?.quarter || "").toUpperCase() !== state.selectedSeason) {
    return false;
  }
  if (
    applyMediaFilter &&
    state.selectedMedia.length &&
    !state.selectedMedia.includes(String(entry.extensions?.media_type || entry.entity_type || "").toUpperCase())
  ) {
    return false;
  }
  return true;
}

function getFavoriteRelationInfo(entry, favorites = getFavoriteSet(), personFavorites = getPersonFavoriteSet(), studioFavorites = getStudioFavoriteSet()) {
  const cast = [];
  const staff = [];
  const studios = [];

  (entry.extensions?.credits?.characters || []).forEach((item) => {
    const personId = canonicalPersonId(item.voice_actor_mal_id);
    if (personId && personFavorites.has(personId)) {
      cast.push(formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name));
    }
  });

  (entry.extensions?.credits?.staff || []).forEach((item) => {
    const personId = canonicalPersonId(item.person_mal_id);
    if (personId && personFavorites.has(personId)) {
      staff.push(`${formatDisplayName(item.name_ja, item.name)}${item.role ? ` / ${item.role}` : ""}`);
    }
  });

  (entry.extensions?.studios || []).forEach((studioName) => {
    const name = String(studioName || "").trim();
    if (name && studioFavorites.has(name)) {
      studios.push(name);
    }
  });

  return {
    title: favorites.has(entry.favorite_key),
    cast: [...new Set(cast)],
    staff: [...new Set(staff)],
    studios: [...new Set(studios)],
    matched: favorites.has(entry.favorite_key) || cast.length > 0 || staff.length > 0 || studios.length > 0,
  };
}

function renderFavoriteReasonPills(entry, favorites = getFavoriteSet(), personFavorites = getPersonFavoriteSet(), studioFavorites = getStudioFavoriteSet()) {
  if (!state.favoritesOnly) {
    return "";
  }
  const info = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
  if (!info.matched) {
    return "";
  }
  const labels = [];
  if (state.selectedFavoriteScopes.includes("TITLE") && info.title) {
    labels.push(state.lang === "ko" ? "작품" : "Title");
  }
  if (state.selectedFavoriteScopes.includes("CAST") && info.cast.length) {
    labels.push(state.lang === "ko" ? `캐스트 ${info.cast.length}` : `Cast ${info.cast.length}`);
  }
  if (state.selectedFavoriteScopes.includes("STAFF") && info.staff.length) {
    labels.push(state.lang === "ko" ? `스태프 ${info.staff.length}` : `Staff ${info.staff.length}`);
  }
  if (state.selectedFavoriteScopes.includes("STUDIO") && info.studios.length) {
    labels.push(state.lang === "ko" ? `회사 ${info.studios.length}` : `Studio ${info.studios.length}`);
  }
  return labels.map((label) => `<span class="pill is-favorite-match">${escapeHtml(label)}</span>`).join("");
}

function matchesSearch(entry) {
  return !state.search || entry.search_text.includes(state.search.toLowerCase());
}

function matchesScheduleStatus(entry) {
  return state.scheduleStatus === "airing" ? statusPriority(entry) === 0 : statusPriority(entry) === 1;
}

function getYearOptions() {
  return [...new Set(
    state.entries
      .filter((entry) => entry.finished && !isMovie(entry))
      .map((entry) => entry.season?.year)
      .filter(Boolean)
      .map((year) => String(year)),
  )].sort((left, right) => Number(right) - Number(left));
}

function ensureFinishedYearSelection() {
  const years = getYearOptions();
  if (!years.length) {
    state.selectedYear = "ALL";
    return;
  }
  if (!state.selectedYear || state.selectedYear === "ALL" || !years.includes(String(state.selectedYear))) {
    state.selectedYear = years[0];
  }
}

function getActiveEntries() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  return state.entries
    .filter((entry) => {
      const favoriteInfo = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
      return !entry.finished
        && !isMovie(entry)
        && (state.scheduleStatus !== "upcoming" || entry.schedule_confidence === "confirmed")
        && matchesScheduleStatus(entry)
        && matchesBaseFilters(entry, favorites, { favoriteInfo, personFavorites, studioFavorites })
        && matchesSearch(entry);
    })
    .sort(compareEntries);
}

function getUpcomingSeasonalEntries() {
  if (state.scheduleStatus !== "upcoming") {
    return [];
  }
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  return state.entries
    .filter((entry) => {
      if (entry.finished || isMovie(entry) || statusPriority(entry) !== 1) {
        return false;
      }
      if (entry.schedule_confidence === "confirmed") {
        return false;
      }
      const favoriteInfo = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
      return matchesBaseFilters(entry, favorites, {
        ignoreDayFilter: true,
        favoriteInfo,
        personFavorites,
        studioFavorites,
      }) && matchesSearch(entry);
    })
    .sort(compareEntries);
}

function getFinishedSearchMatches() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  ensureFinishedYearSelection();
  return state.entries
    .filter((entry) => {
      const favoriteInfo = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
      return entry.finished
        && !isMovie(entry)
        && matchesBaseFilters(entry, favorites, { ignoreDayFilter: true, favoriteInfo, personFavorites, studioFavorites })
        && matchesSearch(entry);
    })
    .sort(compareFinishedEntries);
}

function compareGlobalSearchResults(left, right) {
  if (statusPriority(left) !== statusPriority(right)) {
    return statusPriority(left) - statusPriority(right);
  }
  if (isMovie(left) !== isMovie(right)) {
    return isMovie(left) ? 1 : -1;
  }
  if (left.finished !== right.finished) {
    return left.finished ? 1 : -1;
  }
  if (mediaPriority(left) !== mediaPriority(right)) {
    return mediaPriority(left) - mediaPriority(right);
  }
  if (left.season_sort_value !== right.season_sort_value) {
    return right.season_sort_value - left.season_sort_value;
  }
  if ((right.schedule?.date || "") !== (left.schedule?.date || "")) {
    return (right.schedule?.date || "").localeCompare(left.schedule?.date || "");
  }
  return (left.titles?.ja || "").localeCompare(right.titles?.ja || "", "ja");
}

function getGlobalSearchResults() {
  if (!state.search) {
    return [];
  }
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  return state.entries
    .filter((entry) => {
      const favoriteInfo = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
      return matchesSearch(entry) && matchesBaseFilters(entry, favorites, { ignoreDayFilter: true, favoriteInfo, personFavorites, studioFavorites });
    })
    .sort(compareGlobalSearchResults);
}

function getMovieEntries() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  return state.entries
    .filter((entry) => {
      if (!isMovie(entry) || entry.finished) {
        return false;
      }
      const favoriteInfo = getFavoriteRelationInfo(entry, favorites, personFavorites, studioFavorites);
      if (!matchesBaseFilters(entry, favorites, { ignoreDayFilter: true, favoriteInfo, personFavorites, studioFavorites })) {
        return false;
      }
      if (!matchesSearch(entry)) {
        return false;
      }
      const priority = statusPriority(entry);
      return state.movieTab === "now" ? priority === 0 : priority === 1;
    })
    .sort(compareMovieEntries);
}

function updateStaticText() {
  document.documentElement.lang = state.lang;
  document.documentElement.dataset.theme = state.theme;
  document.title = state.lang === "ko" ? "애니메이션 캘린더" : "Animation Calendar";
  document.getElementById("hero-eyebrow").textContent = t("heroEyebrow");
  document.getElementById("hero-title").textContent = t("heroTitle");
  document.getElementById("hero-text").textContent = t("heroText");
  document.getElementById("meta-active-label").textContent = t("activeMeta");
  document.getElementById("meta-finished-label").textContent = t("finishedMeta");
  document.getElementById("meta-status-label").textContent = t("metaStatus");
  document.getElementById("search-label").textContent = t("searchLabel");
  document.getElementById("year-filter-label").textContent = t("yearFilter");
  document.getElementById("search-input").placeholder = t("searchPlaceholder");
  document.getElementById("favorites-only-label").textContent = t("favoritesOnly");
  document.getElementById("open-favorites").textContent = t("favorites");
  document.getElementById("theme-toggle").textContent = state.theme === "dark" ? t("themeLight") : t("themeDark");
  document.getElementById("status-airing").textContent = t("statusAiring");
  document.getElementById("status-upcoming").textContent = t("statusUpcoming");
  document.getElementById("view-board").textContent = t("board");
  document.getElementById("view-list").textContent = t("list");
  document.getElementById("view-movies").textContent = t("moviesView");
  document.getElementById("view-finished").textContent = t("finishedView");
  document.getElementById("movie-now").textContent = t("movieNow");
  document.getElementById("movie-upcoming").textContent = t("movieUpcoming");
  document.getElementById("favorites-eyebrow").textContent = "";
  document.getElementById("favorites-title").textContent = state.lang === "ko" ? "좋아요 리스트" : "Favorite List";
  document.getElementById("favorites-close").textContent = t("close");
  document.getElementById("detail-close").textContent = t("close");
  document.getElementById("relation-close").textContent = t("close");
  document.getElementById("lang-toggle").textContent = state.lang === "ko" ? "EN" : "KO";
  document.getElementById("total-count").textContent = formatEntryCount(state.activeCount || 0);
  document.getElementById("finished-total").textContent = formatEntryCount(state.finishedCount || 0);
  document.getElementById("total-note").textContent = activeMetaNote();
  document.getElementById("finished-note").textContent = finishedMetaNote();
  document.getElementById("meta-status-main").textContent = formatGeneratedAt(state.dataset?.generated_at);
  document.getElementById("meta-status-sub").textContent = metaStatusSubtext();
  document.getElementById("search-input").value = state.searchDraft;
  document.getElementById("favorites-only").checked = state.favoritesOnly;
}

function renderDayFilters() {
  const container = document.getElementById("day-filters");
  const days = ["ALL", ...DAY_ORDER];
  container.innerHTML = days.map((day) => {
    const activeClass = state.selectedDay === day ? "is-active" : "";
    return `<button class="day-chip ${activeClass}" type="button" data-day="${day}">${escapeHtml(dayLabel(day))}</button>`;
  }).join("");
}

function renderYearFilter() {
  const target = document.getElementById("year-filter");
  const years = getYearOptions();
  target.innerHTML = years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join("");
  ensureFinishedYearSelection();
  target.value = years.includes(String(state.selectedYear)) ? state.selectedYear : (years[0] || "");
}

function renderSeasonFilters() {
  const target = document.getElementById("season-filters");
  target.innerHTML = SEASON_FILTER_ORDER.map((season) => {
    const activeClass = state.selectedSeason === season ? "is-active" : "";
    return `<button class="day-chip ${activeClass}" type="button" data-season="${season}">${escapeHtml(seasonFilterLabel(season))}</button>`;
  }).join("");
}

function renderMediaFilters() {
  const target = document.getElementById("media-filters");
  target.innerHTML = MEDIA_FILTER_ORDER.map((media) => {
    const isActive = media === "ALL" ? state.selectedMedia.length === 0 : state.selectedMedia.includes(media);
    const activeClass = isActive ? "is-active" : "";
    return `<button class="day-chip ${activeClass}" type="button" data-media="${media}">${escapeHtml(mediaFilterLabel(media))}</button>`;
  }).join("");
}

function renderFavoriteScopeFilters() {
  const target = document.getElementById("favorite-scope-filters");
  const row = document.getElementById("favorite-scope-row");
  target.innerHTML = FAVORITE_SCOPE_ORDER.map((scope) => {
    const activeClass = state.selectedFavoriteScopes.includes(scope) ? "is-active" : "";
    return `<button class="day-chip ${activeClass}" type="button" data-favorite-scope="${scope}">${escapeHtml(favoriteScopeLabel(scope))}</button>`;
  }).join("");
  row.classList.toggle("is-inactive", !state.favoritesOnly);
}

function renderSummaryStrip(activeEntries, finishedMatches) {
  document.getElementById("summary-strip").innerHTML = [
    { label: t("buildMeta"), value: formatGeneratedAt(state.dataset?.generated_at) },
    { label: t("liveMeta"), value: formatGeneratedAt(state.dataset?.collector_status?.last_live_sync_at) },
    { label: t("backfillMeta"), value: formatCollectorSeason(state.dataset?.collector_status?.oldest_completed_season) },
    { label: t("sourceMeta"), value: state.dataset?.dataset?.primary_source || t("loading") },
  ].map((item) => `
    <div class="summary-card summary-note">
      <span class="meta-label">${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");
}

function renderEmpty(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function renderLinkButton(url, label) {
  if (!url) {
    return "";
  }
  return `<a class="link-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function formatDisplayName(nativeName, fallbackName) {
  const nativeText = String(nativeName || "").trim();
  const fallbackText = String(fallbackName || "").trim();
  if (nativeText && fallbackText && nativeText !== fallbackText) {
    return `${nativeText} (${fallbackText})`;
  }
  return nativeText || fallbackText || "-";
}

function summarizeStudios(entry, limit = 2) {
  return (entry.extensions?.studios || []).slice(0, limit).join(" · ");
}

function summarizeLeadCast(entry, limit = 2) {
  const items = (entry.extensions?.credits?.characters || [])
    .filter((item) => item.voice_actor_name || item.voice_actor_name_ja)
    .slice(0, limit)
    .map((item) => `${formatDisplayName(item.character_name_ja, item.character_name)} / ${formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name)}`);
  return items.join(" · ");
}

function summarizeLeadStaff(entry, limit = 2) {
  const prioritized = (entry.extensions?.credits?.staff || [])
    .filter((item) => {
      const role = String(item.role || "").toLowerCase();
      return role.includes("director") || role.includes("series composition") || role.includes("original creator");
    })
    .slice(0, limit)
    .map((item) => `${formatDisplayName(item.name_ja, item.name)} / ${item.role || "-"}`);
  return prioritized.join(" · ");
}

function renderAnimeCard(entry, options = {}) {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  const isFavorite = favorites.has(entry.favorite_key);
  const episodeLabel = currentEpisodeLabel(entry);
  const variant = options.variant || (options.finished ? "finished" : "default");
  const isExpandedList = Boolean(options.expandedList);
  const favoriteReasonTags = renderFavoriteReasonPills(entry, favorites, personFavorites, studioFavorites);
  const tags = [
    `<span class="pill">${escapeHtml(formatMediaType(entry))}</span>`,
    variant !== "movie" && entry.broadcasters?.network ? `<span class="pill">${escapeHtml(entry.broadcasters.network)}</span>` : "",
    `<span class="pill">${escapeHtml(formatStatus(entry))}</span>`,
    variant === "default" && statusPriority(entry) === 1 ? `<span class="pill is-accent">${escapeHtml(formatSeasonShort(entry))}</span>` : "",
    variant !== "movie" && statusPriority(entry) === 1 && entry.schedule_confidence !== "confirmed" ? `<span class="pill">${escapeHtml(scheduleConfidenceLabel(entry))}</span>` : "",
    variant === "finished" ? `<span class="pill">${escapeHtml(formatSeasonCompact(entry))}</span>` : "",
    favoriteReasonTags,
    isExpandedList ? (entry.tags || []).slice(0, 4).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("") : "",
  ].filter(Boolean).join("");
  const studioSummary = summarizeStudios(entry);
  const castSummary = summarizeLeadCast(entry);
  const staffSummary = summarizeLeadStaff(entry);
  const scheduleLine = variant === "movie"
    ? `
        <div class="schedule-line movie-schedule-line">
          <span class="schedule-prefix">${escapeHtml(t("release"))}</span>
          <span class="time-badge movie-date-badge">${escapeHtml(formatDisplayDate(entry.schedule?.date))}</span>
          <span class="schedule-day">${escapeHtml(dayShortEn(entry.schedule?.day_of_week))}</span>
        </div>
      `
    : `
        <div class="schedule-line">
          <span>${escapeHtml(formatDisplayDate(entry.schedule?.date))}</span>
          <span class="schedule-day">${escapeHtml(dayShortEn(entry.schedule?.day_of_week))}</span>
          <span>·</span>
          <span class="time-badge">${escapeHtml(formatDisplayTime(entry.schedule?.time))}</span>
        </div>
      `;

  return `
    <article class="anime-card ${options.finished ? "is-finished" : ""} ${variant === "movie" ? "is-movie" : ""} ${isExpandedList ? "is-list-card" : ""}">
      <div class="card-top">
        ${scheduleLine}
        <button class="favorite-btn ${isFavorite ? "is-active" : ""}" type="button" data-favorite-key="${escapeHtml(entry.favorite_key)}" aria-label="Toggle favorite">★</button>
      </div>
      <div class="card-title-row">
        <button class="title-button" type="button" data-open-details="${escapeHtml(entry.id)}">${escapeHtml(entry.titles?.ja || entry.titles?.en || "-")}</button>
        ${episodeLabel ? `<span class="episode-badge">${escapeHtml(episodeLabel)}</span>` : ""}
      </div>
      <p class="title-secondary">${escapeHtml(entry.titles?.en || "-")}</p>
      <div class="meta-row">${tags}</div>
      ${isExpandedList && studioSummary ? `<div class="detail-inline"><strong>${escapeHtml(t("studios"))}</strong><span>${escapeHtml(studioSummary)}</span></div>` : ""}
      ${isExpandedList && castSummary ? `<div class="detail-inline"><strong>${escapeHtml(t("cast"))}</strong><span>${escapeHtml(castSummary)}</span></div>` : ""}
      ${isExpandedList && staffSummary ? `<div class="detail-inline"><strong>${escapeHtml(t("staff"))}</strong><span>${escapeHtml(staffSummary)}</span></div>` : ""}
      ${isExpandedList ? `
        <div class="link-row">
          ${renderLinkButton(entry.source_links?.official, t("official"))}
          ${renderLinkButton(entry.extensions?.links?.x, t("x"))}
        </div>
      ` : ""}
    </article>
  `;
}

function renderListPeopleChips(items, type, favoriteSet) {
  if (!items.length) {
    return "";
  }

  const markup = items.map((item) => {
    const rawPersonId = type === "cast" ? String(item.voice_actor_mal_id || "") : String(item.person_mal_id || "");
    const personId = canonicalPersonId(rawPersonId);
    const label = type === "cast"
      ? `${formatDisplayName(item.character_name_ja, item.character_name)} / ${formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name)}`
      : `${formatDisplayName(item.name_ja, item.name)} / ${item.role || "-"}`;
    if (!personId) {
      return `<span class="credit-chip person-inline-chip">${escapeHtml(label)}</span>`;
    }
    const activeClass = favoriteSet.has(personId) ? "is-active" : "";
    return `
      <span class="inline-chip-row">
        <button class="credit-chip person-inline-chip person-open-chip" type="button" data-open-person="${escapeHtml(personId)}">${escapeHtml(label)}</button>
        <button class="credit-chip credit-toggle chip-favorite-btn ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}" aria-label="Toggle person favorite">★</button>
      </span>
    `;
  }).join("");

  return `<span class="person-inline-list">${markup}</span>`;
}

function renderStudioFavoriteChips(studios, favoriteSet, limit = studios.length) {
  if (!studios.length) {
    return "";
  }
  const markup = studios.slice(0, limit).map((studioName) => {
    const name = String(studioName || "").trim();
    if (!name) {
      return "";
    }
    const activeClass = favoriteSet.has(name) ? "is-active" : "";
    return `
      <span class="inline-chip-row">
        <button class="credit-chip studio-inline-chip studio-open-chip" type="button" data-open-studio="${escapeHtml(name)}">${escapeHtml(name)}</button>
        <button class="credit-chip credit-toggle chip-favorite-btn ${activeClass}" type="button" data-studio-favorite-name="${escapeHtml(name)}" aria-label="Toggle studio favorite">★</button>
      </span>
    `;
  }).filter(Boolean).join("");
  return `<span class="person-inline-list studio-inline-list">${markup}</span>`;
}

function renderListAnimeCard(entry) {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  const isFavorite = favorites.has(entry.favorite_key);
  const episodeLabel = currentEpisodeLabel(entry);
  const metaTags = [
    `<span class="pill">${escapeHtml(formatMediaType(entry))}</span>`,
    entry.broadcasters?.network ? `<span class="pill">${escapeHtml(entry.broadcasters.network)}</span>` : "",
    `<span class="pill">${escapeHtml(formatStatus(entry))}</span>`,
    statusPriority(entry) === 1 ? `<span class="pill is-accent">${escapeHtml(formatSeasonShort(entry))}</span>` : "",
    statusPriority(entry) === 1 && entry.schedule_confidence !== "confirmed" ? `<span class="pill">${escapeHtml(scheduleConfidenceLabel(entry))}</span>` : "",
    renderFavoriteReasonPills(entry, favorites, personFavorites, studioFavorites),
  ].filter(Boolean).join("");
  const genrePills = (entry.tags || []).slice(0, 6).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
  const studioMarkup = renderStudioFavoriteChips(entry.extensions?.studios || [], studioFavorites, 2);
  const castMarkup = renderListPeopleChips((entry.extensions?.credits?.characters || [])
    .filter((item) => item.voice_actor_name || item.voice_actor_name_ja)
    .slice(0, 2), "cast", personFavorites);
  const staffMarkup = renderListPeopleChips((entry.extensions?.credits?.staff || [])
    .filter((item) => {
      const role = String(item.role || "").toLowerCase();
      return role.includes("director") || role.includes("series composition") || role.includes("original creator");
    })
    .slice(0, 2), "staff", personFavorites);
  const officialLink = renderLinkButton(entry.source_links?.official, t("official"));
  const xLink = renderLinkButton(entry.extensions?.links?.x, t("x"));

  return `
    <article class="anime-card is-list-card">
      <div class="list-card-main">
        <div class="card-top">
          <div class="schedule-line">
            <span>${escapeHtml(formatDisplayDate(entry.schedule?.date))}</span>
            <span class="schedule-day">${escapeHtml(dayShortEn(entry.schedule?.day_of_week))}</span>
            <span class="schedule-sep">/</span>
            <span class="time-badge">${escapeHtml(formatDisplayTime(entry.schedule?.time))}</span>
          </div>
          <button class="favorite-btn ${isFavorite ? "is-active" : ""}" type="button" data-favorite-key="${escapeHtml(entry.favorite_key)}" aria-label="Toggle favorite">★</button>
        </div>
        <div class="card-title-row">
          <button class="title-button" type="button" data-open-details="${escapeHtml(entry.id)}">${escapeHtml(entry.titles?.ja || entry.titles?.en || "-")}</button>
          ${episodeLabel ? `<span class="episode-badge">${escapeHtml(episodeLabel)}</span>` : ""}
        </div>
        <p class="title-secondary">${escapeHtml(entry.titles?.en || "-")}</p>
        <div class="meta-row">${metaTags}</div>
      </div>
      <aside class="list-card-side">
        ${genrePills ? `<div class="meta-row list-side-tags">${genrePills}</div>` : ""}
        ${studioMarkup ? `<div class="detail-inline detail-inline-people"><strong>${escapeHtml(t("studios"))}</strong>${studioMarkup}</div>` : ""}
        ${castMarkup ? `<div class="detail-inline detail-inline-people"><strong>${escapeHtml(t("cast"))}</strong>${castMarkup}</div>` : ""}
        ${staffMarkup ? `<div class="detail-inline detail-inline-people"><strong>${escapeHtml(t("staff"))}</strong>${staffMarkup}</div>` : ""}
        ${officialLink || xLink ? `<div class="link-row list-view-links">${officialLink}${xLink}</div>` : ""}
      </aside>
    </article>
  `;
}

function renderBoard(entries) {
  const target = document.getElementById("board-view");
  const visibleDays = state.selectedDay === "ALL" ? DAY_ORDER : [state.selectedDay];
  const seasonalEntries = getUpcomingSeasonalEntries();

  if (!entries.length && !seasonalEntries.length) {
    target.innerHTML = renderEmpty(t("noActive"));
    return;
  }

  const columns = visibleDays.map((day) => {
    const dayEntries = entries.filter((entry) => entry.schedule.day_of_week === day);
    return `
      <section class="day-column ${dayClass(day)}">
        <div class="day-head">
          <h2>${dayHeading(day)}</h2>
          <span class="day-count">${escapeHtml(formatCount(dayEntries.length))}</span>
        </div>
        <div class="anime-stack">
          ${dayEntries.length ? dayEntries.map((entry) => renderAnimeCard(entry)).join("") : renderEmpty(t("noActiveDay"))}
        </div>
      </section>
    `;
  }).join("");

  const seasonalMarkup = seasonalEntries.length ? `
    <section class="search-group seasonal-upcoming-group">
      <div class="search-head">
        <div>
          <h2>${escapeHtml(t("upcomingSeasonalTitle"))}</h2>
          <p class="section-subcopy">${escapeHtml(t("upcomingSeasonalText"))}</p>
        </div>
        <span class="day-count">${escapeHtml(formatCount(seasonalEntries.length))}</span>
      </div>
      <div class="finished-grid">
        ${seasonalEntries.map((entry) => renderAnimeCard(entry)).join("")}
      </div>
    </section>
  ` : "";

  target.innerHTML = `${entries.length ? `<div class="board-grid ${visibleDays.length < 7 ? "compact" : ""}">${columns}</div>` : ""}${seasonalMarkup}`;
}

function renderList(entries) {
  const target = document.getElementById("list-view");
  const seasonalEntries = getUpcomingSeasonalEntries();
  if (!entries.length && !seasonalEntries.length) {
    target.innerHTML = renderEmpty(t("noActive"));
    return;
  }

  const groups = DAY_ORDER.map((day) => {
    const dayEntries = entries.filter((entry) => entry.schedule.day_of_week === day);
    if (!dayEntries.length) {
      return "";
    }
    return `
      <section class="list-group ${dayClass(day)}">
        <div class="day-head">
          <h2>${dayHeading(day)}</h2>
          <span class="day-count">${escapeHtml(formatCount(dayEntries.length))}</span>
        </div>
        <div class="anime-stack">
          ${dayEntries.map((entry) => renderListAnimeCard(entry)).join("")}
        </div>
      </section>
    `;
  }).join("");

  const seasonalMarkup = seasonalEntries.length ? `
    <section class="search-group seasonal-upcoming-group">
      <div class="search-head">
        <div>
          <h2>${escapeHtml(t("upcomingSeasonalTitle"))}</h2>
          <p class="section-subcopy">${escapeHtml(t("upcomingSeasonalText"))}</p>
        </div>
        <span class="day-count">${escapeHtml(formatCount(seasonalEntries.length))}</span>
      </div>
      <div class="finished-grid">
        ${seasonalEntries.map((entry) => renderAnimeCard(entry)).join("")}
      </div>
    </section>
  ` : "";

  target.innerHTML = `<div class="list-wrap">${groups}${seasonalMarkup}</div>`;
}

function renderMovieView(entries) {
  const target = document.getElementById("movie-view");
  if (!entries.length) {
    target.innerHTML = renderEmpty(t("noMovies"));
    return;
  }

  target.innerHTML = `
    <div class="movie-wrap">
      <section class="search-group">
        <div class="search-head">
          <h2>${escapeHtml(state.movieTab === "now" ? t("movieNowTitle") : t("movieUpcomingTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatCount(entries.length))}</span>
        </div>
        <div class="movie-grid">
          ${entries.map((entry) => renderAnimeCard(entry, { variant: "movie" })).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderFinishedView(entries) {
  const target = document.getElementById("finished-view");
  const selectedYearLabel = state.selectedYear && state.selectedYear !== "ALL" ? ` ${escapeHtml(String(state.selectedYear))}` : "";
  if (!entries.length) {
    target.innerHTML = renderEmpty(t("noFinished"));
    return;
  }

  target.innerHTML = `
    <div class="search-wrap">
      <section class="search-group">
        <div class="search-head">
          <h2>${escapeHtml(t("finishedSearchTitle"))}${selectedYearLabel}</h2>
          <span class="day-count">${escapeHtml(formatCount(entries.length))}</span>
        </div>
        <div class="finished-grid">
          ${entries.map((entry) => renderAnimeCard(entry, { finished: true, variant: "finished" })).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderSearchResults(entries) {
  const target = document.getElementById("search-results");
  if (!state.search) {
    target.innerHTML = "";
    return;
  }
  if (!entries.length) {
    target.innerHTML = renderEmpty(t("noSearch"));
    return;
  }

  target.innerHTML = `
    <div class="search-wrap">
      <section class="search-group">
        <div class="search-head">
          <h2>${escapeHtml(t("searchResultsTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatCount(entries.length))}</span>
        </div>
        <div class="finished-grid">
          ${entries.map((entry) => {
            if (isMovie(entry)) {
              return renderAnimeCard(entry, { variant: "movie", finished: entry.finished });
            }
            if (entry.finished) {
              return renderAnimeCard(entry, { finished: true, variant: "finished" });
            }
            return renderAnimeCard(entry);
          }).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderFavoritesModal() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  const items = state.entries.filter((entry) => favorites.has(entry.favorite_key)).sort(compareEntries);
  const people = [...personFavorites]
    .map((personId) => state.peopleIndex.get(String(personId)))
    .filter(Boolean)
    .sort((left, right) => (right.entry_ids?.length || 0) - (left.entry_ids?.length || 0));
  const studios = [...studioFavorites]
    .map((studioName) => state.studioIndex.get(String(studioName)))
    .filter(Boolean)
    .sort((left, right) => (right.entry_ids?.length || 0) - (left.entry_ids?.length || 0));
  const target = document.getElementById("favorites-list");
  const peopleMarkup = people.length
    ? `
      <section class="search-group favorites-section">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritePeopleTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatCount(people.length))}</span>
        </div>
        <div class="people-grid">
          ${people.map((person) => {
            const relatedTitles = (person.entry_ids || [])
              .slice(0, 4)
              .map((entryId) => state.entryIndex.get(entryId))
              .filter(Boolean)
              .map((entry) => entry.titles?.ja || entry.titles?.en || entry.id)
              .join(" · ");
            const roles = [...new Set((person.roles || []).map((item) => item.role).filter(Boolean))].slice(0, 3).join(" · ");
            return `
              <article class="person-card">
                <div class="person-card-top">
                  <strong>${escapeHtml(formatDisplayName(person.name_ja, person.name))}</strong>
                  <button class="favorite-chip is-active" type="button" data-person-favorite-id="${escapeHtml(person.id)}">★</button>
                </div>
                ${roles ? `<p class="person-meta">${escapeHtml(roles)}</p>` : ""}
                <p class="person-meta">${escapeHtml(`${person.entry_ids?.length || 0} works`)}</p>
                ${relatedTitles ? `<p class="person-links">${escapeHtml(relatedTitles)}</p>` : ""}
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritePeopleTitle"))}</h2>
        </div>
        ${renderEmpty(t("noFavoritePeople"))}
      </section>
    `;

  const titleMarkup = items.length
    ? `
      <section class="search-group favorites-section">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritesTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatCount(items.length))}</span>
        </div>
        <div class="favorites-list-grid">
          ${items.map((entry) => renderAnimeCard(entry, { finished: entry.finished })).join("")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritesTitle"))}</h2>
        </div>
        ${renderEmpty(t("noFavorites"))}
      </section>
    `;

  target.innerHTML = `${titleMarkup}${peopleMarkup}`;
}

function renderFavoritesModal() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const items = state.entries.filter((entry) => favorites.has(entry.favorite_key)).sort(compareEntries);
  const people = [...personFavorites]
    .map((personId) => state.peopleIndex.get(String(personId)))
    .filter(Boolean)
    .sort((left, right) => (right.entry_ids?.length || 0) - (left.entry_ids?.length || 0));
  const target = document.getElementById("favorites-list");
  const formatPeopleCount = (value) => state.lang === "ko" ? `${value}명` : `${value} people`;
  const formatWorksCount = (value) => state.lang === "ko" ? `${value}작품` : `${value} works`;
  const groups = { cast: [], staff: [] };

  people.forEach((person) => {
    const voiceActorCount = (person.roles || []).filter((item) => item.kind === "voice_actor").length;
    const staffCount = (person.roles || []).filter((item) => item.kind === "staff").length;
    if (voiceActorCount >= staffCount) {
      groups.cast.push(person);
    } else {
      groups.staff.push(person);
    }
  });

  const renderPersonCard = (person, type) => {
    const allRelevantRoles = (person.roles || [])
      .filter((item) => type === "cast" ? item.kind === "voice_actor" : item.kind === "staff");
    const relevantRoles = allRelevantRoles.slice(0, 4);
    const summary = type === "cast"
      ? [...new Set(allRelevantRoles.map((item) => formatDisplayName(item.character_name_ja, item.character_name)).filter(Boolean))].slice(0, 2).join(" / ")
      : [...new Set(allRelevantRoles.map((item) => item.role).filter(Boolean))].slice(0, 2).join(" / ");
    const titleChips = relevantRoles.map((item) => {
      const entry = state.entryIndex.get(item.entry_id);
      if (!entry) {
        return "";
      }
      const title = entry.titles?.ja || entry.titles?.en || entry.id;
      const sub = type === "cast"
        ? formatDisplayName(item.character_name_ja, item.character_name)
        : (item.role || "");
      return `<span class="person-work-chip">${escapeHtml(title)}${sub ? `<small>${escapeHtml(sub)}</small>` : ""}</span>`;
    }).filter(Boolean).join("");
    return `
      <article class="person-card">
        <div class="person-card-top">
          <div class="person-head-copy">
            <strong>${escapeHtml(formatDisplayName(person.name_ja, person.name))}</strong>
            ${summary ? `<p class="person-meta">${escapeHtml(summary)}</p>` : ""}
          </div>
          <button class="favorite-chip is-active" type="button" data-person-favorite-id="${escapeHtml(person.id)}">★</button>
        </div>
        <p class="person-meta">${escapeHtml(formatWorksCount(person.entry_ids?.length || 0))}</p>
        ${titleChips ? `<div class="person-work-list">${titleChips}</div>` : ""}
      </article>
    `;
  };

  const renderPeopleColumn = (title, entries, type) => `
    <section class="favorite-people-column">
      <div class="search-head">
        <h2>${escapeHtml(title)}</h2>
        <span class="day-count">${escapeHtml(formatPeopleCount(entries.length))}</span>
      </div>
      ${entries.length ? `<div class="people-grid">${entries.map((person) => renderPersonCard(person, type)).join("")}</div>` : renderEmpty(t("noFavoritePeople"))}
    </section>
  `;

  const titleMarkup = items.length
    ? `
      <section class="search-group favorites-section favorites-titles-panel">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritesTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatCount(items.length))}</span>
        </div>
        <div class="favorites-list-grid">
          ${items.map((entry) => renderAnimeCard(entry, { finished: entry.finished })).join("")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section favorites-titles-panel">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritesTitle"))}</h2>
        </div>
        ${renderEmpty(t("noFavorites"))}
      </section>
    `;

  const peopleMarkup = people.length
    ? `
      <section class="search-group favorites-section favorites-people-panel">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritePeopleTitle"))}</h2>
          <span class="day-count">${escapeHtml(formatPeopleCount(people.length))}</span>
        </div>
        <div class="favorite-people-layout">
          ${renderPeopleColumn(state.lang === "ko" ? "캐스트" : "Cast", groups.cast, "cast")}
          ${renderPeopleColumn(state.lang === "ko" ? "스태프" : "Staff", groups.staff, "staff")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section favorites-people-panel">
        <div class="search-head">
          <h2>${escapeHtml(t("favoritePeopleTitle"))}</h2>
        </div>
        ${renderEmpty(t("noFavoritePeople"))}
      </section>
    `;
  const studioMarkup = studios.length
    ? `
      <section class="search-group favorites-section favorites-studios-panel">
        <div class="search-head">
          <h2>${escapeHtml(state.lang === "ko" ? "좋아요 제작사" : "Favorite Studios")}</h2>
          <span class="day-count">${escapeHtml(state.lang === "ko" ? `${studios.length}개` : `${studios.length} studios`)}</span>
        </div>
        <div class="people-grid">
          ${studios.map((studio) => {
            const titleChips = (studio.entry_ids || [])
              .slice(0, 4)
              .map((entryId) => state.entryIndex.get(entryId))
              .filter(Boolean)
              .map((entry) => `<span class="person-work-chip">${escapeHtml(entry.titles?.ja || entry.titles?.en || entry.id)}</span>`)
              .join("");
            return `
              <article class="person-card studio-card">
                <div class="person-card-top">
                  <div class="person-head-copy">
                    <strong>${escapeHtml(studio.name)}</strong>
                  </div>
                  <button class="favorite-chip is-active" type="button" data-studio-favorite-name="${escapeHtml(studio.name)}">★</button>
                </div>
                <p class="person-meta">${escapeHtml(state.lang === "ko" ? `${studio.entry_ids?.length || 0}작품` : `${studio.entry_ids?.length || 0} works`)}</p>
                ${titleChips ? `<div class="person-work-list">${titleChips}</div>` : ""}
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section favorites-studios-panel">
        <div class="search-head">
          <h2>${escapeHtml(state.lang === "ko" ? "좋아요 제작사" : "Favorite Studios")}</h2>
        </div>
        ${renderEmpty(state.lang === "ko" ? "좋아요한 제작사가 없습니다." : "No favorite studios yet.")}
      </section>
    `;

  target.innerHTML = `<div class="favorites-dashboard">${titleMarkup}<div class="favorites-side-stack">${peopleMarkup}${studioMarkup}</div></div>`;
}

function renderFavoritesModal() {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  const items = state.entries.filter((entry) => favorites.has(entry.favorite_key)).sort(compareEntries);
  const people = [...personFavorites]
    .map((personId) => state.peopleIndex.get(String(personId)))
    .filter(Boolean)
    .sort((left, right) => (right.entry_ids?.length || 0) - (left.entry_ids?.length || 0));
  const studios = [...studioFavorites]
    .map((studioName) => state.studioIndex.get(String(studioName)))
    .filter(Boolean)
    .sort((left, right) => (right.entry_ids?.length || 0) - (left.entry_ids?.length || 0));
  const target = document.getElementById("favorites-list");

  const personCountLabel = (value) => state.lang === "ko" ? `${value}명` : `${value} people`;
  const studioCountLabel = (value) => state.lang === "ko" ? `${value}개` : `${value} studios`;
  const worksCountLabel = (value) => state.lang === "ko" ? `${value}작품` : `${value} works`;

  const groups = { cast: [], staff: [] };
  people.forEach((person) => {
    const voiceActorCount = (person.roles || []).filter((item) => item.kind === "voice_actor").length;
    const staffCount = (person.roles || []).filter((item) => item.kind === "staff").length;
    if (voiceActorCount >= staffCount) {
      groups.cast.push(person);
    } else {
      groups.staff.push(person);
    }
  });

  const renderPersonCard = (person, type) => {
    const allRelevantRoles = (person.roles || [])
      .filter((item) => type === "cast" ? item.kind === "voice_actor" : item.kind === "staff");
    const relevantRoles = allRelevantRoles.slice(0, 4);
    const summary = type === "cast"
      ? [...new Set(relevantRoles.map((item) => formatDisplayName(item.character_name_ja, item.character_name)).filter(Boolean))].slice(0, 2).join(" / ")
      : [...new Set(relevantRoles.map((item) => item.role).filter(Boolean))].slice(0, 2).join(" / ");
    const titleChips = relevantRoles.map((item) => {
      const entry = state.entryIndex.get(item.entry_id);
      if (!entry) {
        return "";
      }
      const title = entry.titles?.ja || entry.titles?.en || entry.id;
      const sub = type === "cast" ? formatDisplayName(item.character_name_ja, item.character_name) : (item.role || "");
      return `<button class="person-work-chip" type="button" data-open-details="${escapeHtml(item.entry_id)}">${escapeHtml(title)}${sub ? `<small>${escapeHtml(sub)}</small>` : ""}</button>`;
    }).filter(Boolean);
    if (allRelevantRoles.length > relevantRoles.length) {
      titleChips.push(`<button class="person-work-chip person-more-chip" type="button" data-open-person="${escapeHtml(person.id)}">${escapeHtml(state.lang === "ko" ? `전체 보기 +${allRelevantRoles.length - relevantRoles.length}` : `See all +${allRelevantRoles.length - relevantRoles.length}`)}</button>`);
    }
    return `
      <article class="person-card">
        <div class="person-card-top">
          <div class="person-head-copy">
            <button class="person-link-button" type="button" data-open-person="${escapeHtml(person.id)}">${escapeHtml(formatDisplayName(person.name_ja, person.name))}</button>
            ${summary ? `<p class="person-meta">${escapeHtml(summary)}</p>` : ""}
          </div>
          <button class="favorite-chip is-active" type="button" data-person-favorite-id="${escapeHtml(person.id)}">★</button>
        </div>
        <p class="person-meta">${escapeHtml(worksCountLabel(person.entry_ids?.length || 0))}</p>
        ${titleChips.length ? `<div class="person-work-list">${titleChips.join("")}</div>` : ""}
      </article>
    `;
  };

  const renderPeopleColumn = (title, entries, type) => `
    <section class="favorite-people-column">
      <div class="search-head">
        <h2>${escapeHtml(title)}</h2>
        <span class="day-count">${escapeHtml(personCountLabel(entries.length))}</span>
      </div>
      ${entries.length
        ? `<div class="people-grid">${entries.map((person) => renderPersonCard(person, type)).join("")}</div>`
        : renderEmpty(t("noFavoritePeople"))}
    </section>
  `;

  const titleMarkup = items.length
    ? `
      <section class="search-group favorites-section favorites-titles-panel">
        <div class="search-head">
          <h2>${escapeHtml(state.lang === "ko" ? "작품" : "Titles")}</h2>
          <span class="day-count">${escapeHtml(formatCount(items.length))}</span>
        </div>
        <div class="favorites-list-grid">
          ${items.map((entry) => renderAnimeCard(entry, { finished: entry.finished })).join("")}
        </div>
      </section>
    `
    : `
      <section class="search-group favorites-section favorites-titles-panel">
        <div class="search-head">
          <h2>${escapeHtml(state.lang === "ko" ? "작품" : "Titles")}</h2>
        </div>
        ${renderEmpty(t("noFavorites"))}
      </section>
    `;

  const peopleMarkup = `
    <section class="search-group favorites-section favorites-people-panel">
      <div class="search-head">
        <h2>${escapeHtml(state.lang === "ko" ? "인물" : "People")}</h2>
        <span class="day-count">${escapeHtml(personCountLabel(people.length))}</span>
      </div>
      ${people.length
        ? `<div class="favorite-people-layout">
            ${renderPeopleColumn(state.lang === "ko" ? "캐스트" : "Cast", groups.cast, "cast")}
            ${renderPeopleColumn(state.lang === "ko" ? "스태프" : "Staff", groups.staff, "staff")}
          </div>`
        : renderEmpty(t("noFavoritePeople"))}
    </section>
  `;

  const studioMarkup = `
    <section class="search-group favorites-section favorites-studios-panel">
      <div class="search-head">
        <h2>${escapeHtml(state.lang === "ko" ? "회사" : "Studios")}</h2>
        <span class="day-count">${escapeHtml(studioCountLabel(studios.length))}</span>
      </div>
      ${studios.length
        ? `<div class="people-grid">
            ${studios.map((studio) => {
              const allEntryIds = studio.entry_ids || [];
              const titleChips = allEntryIds
                .slice(0, 4)
                .map((entryId) => state.entryIndex.get(entryId))
                .filter(Boolean)
                .map((entry) => `<button class="person-work-chip" type="button" data-open-details="${escapeHtml(entry.id)}">${escapeHtml(entry.titles?.ja || entry.titles?.en || entry.id)}</button>`);
              if (allEntryIds.length > 4) {
                titleChips.push(`<button class="person-work-chip person-more-chip" type="button" data-open-studio="${escapeHtml(studio.name)}">${escapeHtml(state.lang === "ko" ? `전체 보기 +${allEntryIds.length - 4}` : `See all +${allEntryIds.length - 4}`)}</button>`);
              }
              return `
                <article class="person-card studio-card">
                  <div class="person-card-top">
                    <div class="person-head-copy">
                      <button class="person-link-button" type="button" data-open-studio="${escapeHtml(studio.name)}">${escapeHtml(studio.name)}</button>
                    </div>
                    <button class="favorite-chip is-active" type="button" data-studio-favorite-name="${escapeHtml(studio.name)}">★</button>
                  </div>
                  <p class="person-meta">${escapeHtml(worksCountLabel(studio.entry_ids?.length || 0))}</p>
                  ${titleChips.length ? `<div class="person-work-list">${titleChips.join("")}</div>` : ""}
                </article>
              `;
            }).join("")}
          </div>`
        : renderEmpty(state.lang === "ko" ? "좋아요한 제작사가 없습니다." : "No favorite studios yet.")}
    </section>
  `;

  target.innerHTML = `<div class="favorites-dashboard">${titleMarkup}${peopleMarkup}${studioMarkup}</div>`;
}

function renderCreditsSection(items, formatter, emptyText) {
  if (!items.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }
  return `<div class="detail-credit-list">${items.map(formatter).join("")}</div>`;
}

function bringModalToFront(name) {
  const modal = document.getElementById(`${name}-modal`);
  if (!modal) {
    return;
  }
  modalStackCounter += 2;
  modal.style.zIndex = String(modalStackCounter);
}

function openPersonModal(personId) {
  const person = state.peopleIndex.get(String(personId || ""));
  if (!person) {
    return;
  }
  const visibleWorkCount = relationWorkLimit("person", person.id);
  state.currentRelation = { type: "person", id: String(person.id), visibleWorkCount };

  const relevantEntries = [...new Set((person.entry_ids || []))]
    .map((entryId) => state.entryIndex.get(entryId))
    .filter(Boolean)
    .sort(compareEntries);
  const voiceRoles = (person.roles || []).filter((item) => item.kind === "voice_actor");
  const staffRoles = (person.roles || []).filter((item) => item.kind === "staff");
  const isFavorite = getPersonFavoriteSet().has(String(person.id));

  document.getElementById("relation-kicker").textContent = state.lang === "ko" ? "인물 페이지" : "Person";
  document.getElementById("relation-title").textContent = formatDisplayName(person.name_ja, person.name);
  document.getElementById("relation-subtitle").textContent = state.lang === "ko"
    ? `${person.entry_ids?.length || 0}작품 참여`
    : `${person.entry_ids?.length || 0} related works`;

  const castMarkup = voiceRoles.length
    ? `<div class="relation-role-list">${voiceRoles.slice(0, 24).map((item) => {
      const entry = state.entryIndex.get(item.entry_id);
      const title = entry?.titles?.ja || entry?.titles?.en || item.entry_id;
      return `
        <button class="relation-role-item" type="button" data-open-details="${escapeHtml(item.entry_id)}">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(formatDisplayName(item.character_name_ja, item.character_name))}</span>
        </button>
      `;
    }).join("")}</div>`
    : renderEmpty(t("noCast"));

  const staffMarkup = staffRoles.length
    ? `<div class="relation-role-list">${staffRoles.slice(0, 24).map((item) => {
      const entry = state.entryIndex.get(item.entry_id);
      const title = entry?.titles?.ja || entry?.titles?.en || item.entry_id;
      return `
        <button class="relation-role-item" type="button" data-open-details="${escapeHtml(item.entry_id)}">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(item.role || "-")}</span>
        </button>
      `;
    }).join("")}</div>`
    : renderEmpty(t("noStaff"));

  document.getElementById("relation-body").innerHTML = `
    <section class="detail-section">
      <div class="relation-head-row">
        <div class="detail-pills">
          <span class="pill">${escapeHtml(state.lang === "ko" ? (voiceRoles.length ? "캐스트" : "스태프") : (voiceRoles.length ? "Cast" : "Staff"))}</span>
          <span class="pill">${escapeHtml(state.lang === "ko" ? `${person.entry_ids?.length || 0}작품` : `${person.entry_ids?.length || 0} works`)}</span>
        </div>
        <button class="favorite-btn ${isFavorite ? "is-active" : ""}" type="button" data-person-favorite-id="${escapeHtml(person.id)}">★</button>
      </div>
    </section>
    ${voiceRoles.length ? `<section class="detail-section"><h3>${escapeHtml(state.lang === "ko" ? "캐스트 참여작" : "Cast Credits")}</h3>${castMarkup}</section>` : ""}
    ${staffRoles.length ? `<section class="detail-section"><h3>${escapeHtml(state.lang === "ko" ? "스태프 참여작" : "Staff Credits")}</h3>${staffMarkup}</section>` : ""}
    <section class="detail-section">
      <h3>${escapeHtml(state.lang === "ko" ? "관련 작품" : "Related Works")}</h3>
      <div class="finished-grid">
        ${relevantEntries.slice(0, visibleWorkCount).map((entry) => renderAnimeCard(entry, { finished: entry.finished, variant: isMovie(entry) ? "movie" : (entry.finished ? "finished" : "default") })).join("")}
      </div>
      ${renderRelationMoreButton("person", person.id, visibleWorkCount, relevantEntries.length)}
    </section>
  `;

  document.getElementById("relation-modal").classList.remove("hidden");
  document.getElementById("relation-modal").setAttribute("aria-hidden", "false");
  bringModalToFront("relation");
}

function openStudioModal(studioName) {
  const studio = state.studioIndex.get(String(studioName || "").trim());
  if (!studio) {
    return;
  }
  const visibleWorkCount = relationWorkLimit("studio", studio.name);
  state.currentRelation = { type: "studio", id: studio.name, visibleWorkCount };

  const relatedEntries = [...new Set(studio.entry_ids || [])]
    .map((entryId) => state.entryIndex.get(entryId))
    .filter(Boolean)
    .sort(compareEntries);
  const isFavorite = getStudioFavoriteSet().has(studio.name);

  document.getElementById("relation-kicker").textContent = state.lang === "ko" ? "회사 페이지" : "Studio";
  document.getElementById("relation-title").textContent = studio.name;
  document.getElementById("relation-subtitle").textContent = state.lang === "ko"
    ? `${studio.entry_ids?.length || 0}작품 관련`
    : `${studio.entry_ids?.length || 0} related works`;

  document.getElementById("relation-body").innerHTML = `
    <section class="detail-section">
      <div class="relation-head-row">
        <div class="detail-pills">
          <span class="pill">${escapeHtml(state.lang === "ko" ? "회사" : "Studio")}</span>
          <span class="pill">${escapeHtml(state.lang === "ko" ? `${studio.entry_ids?.length || 0}작품` : `${studio.entry_ids?.length || 0} works`)}</span>
        </div>
        <button class="favorite-btn ${isFavorite ? "is-active" : ""}" type="button" data-studio-favorite-name="${escapeHtml(studio.name)}">★</button>
      </div>
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(state.lang === "ko" ? "관련 작품" : "Related Works")}</h3>
      <div class="finished-grid">
        ${relatedEntries.slice(0, visibleWorkCount).map((entry) => renderAnimeCard(entry, { finished: entry.finished, variant: isMovie(entry) ? "movie" : (entry.finished ? "finished" : "default") })).join("")}
      </div>
      ${renderRelationMoreButton("studio", studio.name, visibleWorkCount, relatedEntries.length)}
    </section>
  `;

  document.getElementById("relation-modal").classList.remove("hidden");
  document.getElementById("relation-modal").setAttribute("aria-hidden", "false");
  bringModalToFront("relation");
}

function openPersonModal(personId) {
  const normalizedId = canonicalPersonId(personId);
  const person = state.peopleIndex.get(String(normalizedId || ""));
  if (!person) {
    return;
  }
  const visibleWorkCount = relationWorkLimit("person", person.id);
  state.currentRelation = { type: "person", id: String(person.id), visibleWorkCount };

  const relevantEntries = [...new Set((person.entry_ids || []))]
    .map((entryId) => state.entryIndex.get(entryId))
    .filter(Boolean)
    .sort(compareEntries);
  const voiceRoles = (person.roles || []).filter((item) => item.kind === "voice_actor");
  const staffRoles = (person.roles || []).filter((item) => item.kind === "staff");
  const isFavorite = getPersonFavoriteSet().has(String(person.id));

  document.getElementById("relation-kicker").textContent = state.lang === "ko" ? "인물 페이지" : "Person";
  document.getElementById("relation-title").textContent = formatDisplayName(person.name_ja, person.name);
  document.getElementById("relation-subtitle").textContent = state.lang === "ko"
    ? `${person.entry_ids?.length || 0}작품 참여`
    : `${person.entry_ids?.length || 0} related works`;

  const castGroups = [];
  const castGroupMap = new Map();
  voiceRoles.forEach((item) => {
    const key = String(item.character_id || "").trim() || `name:${String(item.character_name_ja || item.character_name || "").trim()}`;
    if (!castGroupMap.has(key)) {
      const group = {
        key,
        character: formatDisplayName(item.character_name_ja, item.character_name),
        works: [],
      };
      castGroupMap.set(key, group);
      castGroups.push(group);
    }
    const group = castGroupMap.get(key);
    if (!group.works.some((work) => work.entry_id === item.entry_id)) {
      const entry = state.entryIndex.get(item.entry_id);
      group.works.push({
        entry_id: item.entry_id,
        title: entry?.titles?.ja || entry?.titles?.en || item.entry_id,
        subtitle: entry?.titles?.en || "",
      });
    }
  });
  castGroups.sort((left, right) => (right.works.length - left.works.length) || left.character.localeCompare(right.character));

  const castMarkup = voiceRoles.length
    ? `<div class="relation-cast-grid">${castGroups.slice(0, 24).map((group) => `
      <article class="relation-cast-card">
        <div class="relation-cast-head">
          <strong>${escapeHtml(group.character)}</strong>
          <span>${escapeHtml(state.lang === "ko" ? `${group.works.length}작품` : `${group.works.length} works`)}</span>
        </div>
        <div class="relation-cast-work-list">
          ${group.works.map((work) => `
            <button class="person-work-chip relation-cast-work-chip" type="button" data-open-details="${escapeHtml(work.entry_id)}">
              ${escapeHtml(work.title)}
              ${work.subtitle ? `<small>${escapeHtml(work.subtitle)}</small>` : ""}
            </button>
          `).join("")}
        </div>
      </article>
    `).join("")}</div>`
    : renderEmpty(t("noCast"));

  const staffMarkup = staffRoles.length
    ? `<div class="relation-role-list">${staffRoles.slice(0, 24).map((item) => {
      const entry = state.entryIndex.get(item.entry_id);
      const title = entry?.titles?.ja || entry?.titles?.en || item.entry_id;
      return `
        <button class="relation-role-item" type="button" data-open-details="${escapeHtml(item.entry_id)}">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(item.role || "-")}</span>
        </button>
      `;
    }).join("")}</div>`
    : renderEmpty(t("noStaff"));

  document.getElementById("relation-body").innerHTML = `
    <section class="detail-section">
      <div class="relation-head-row">
        <div class="detail-pills">
          <span class="pill">${escapeHtml(state.lang === "ko" ? (voiceRoles.length ? "캐스트" : "스태프") : (voiceRoles.length ? "Cast" : "Staff"))}</span>
          <span class="pill">${escapeHtml(state.lang === "ko" ? `${person.entry_ids?.length || 0}작품` : `${person.entry_ids?.length || 0} works`)}</span>
        </div>
        <button class="favorite-btn ${isFavorite ? "is-active" : ""}" type="button" data-person-favorite-id="${escapeHtml(person.id)}">★</button>
      </div>
    </section>
    ${voiceRoles.length ? `<section class="detail-section"><h3>${escapeHtml(state.lang === "ko" ? "캐스트 참여작" : "Cast Credits")}</h3>${castMarkup}</section>` : ""}
    ${staffRoles.length ? `<section class="detail-section"><h3>${escapeHtml(state.lang === "ko" ? "스태프 참여작" : "Staff Credits")}</h3>${staffMarkup}</section>` : ""}
    <section class="detail-section">
      <h3>${escapeHtml(state.lang === "ko" ? "관련 작품" : "Related Works")}</h3>
      <div class="finished-grid">
        ${relevantEntries.slice(0, visibleWorkCount).map((entry) => renderAnimeCard(entry, { finished: entry.finished, variant: isMovie(entry) ? "movie" : (entry.finished ? "finished" : "default") })).join("")}
      </div>
      ${renderRelationMoreButton("person", person.id, visibleWorkCount, relevantEntries.length)}
    </section>
  `;

  document.getElementById("relation-modal").classList.remove("hidden");
  document.getElementById("relation-modal").setAttribute("aria-hidden", "false");
  bringModalToFront("relation");
}

function openDetailModal(entryId) {
  const entry = state.entryIndex.get(entryId);
  if (!entry) {
    return;
  }
  state.currentDetailEntryId = entryId;

  const detailBody = document.getElementById("detail-body");
  const credits = entry.extensions?.credits || {};
  const characters = credits.characters || [];
  const staff = credits.staff || [];
  const personFavorites = getPersonFavoriteSet();
  const studioFavorites = getStudioFavoriteSet();
  const tags = entry.tags || [];
  const studios = entry.extensions?.studios || [];

  document.getElementById("detail-kicker").textContent = `${t("detailsKicker")} / ${formatStatus(entry)}`;
  document.getElementById("detail-title").textContent = entry.titles?.ja || entry.titles?.en || "-";
  document.getElementById("detail-subtitle").textContent = entry.titles?.en || "-";

  detailBody.innerHTML = `
    <section class="detail-section">
      <div class="detail-grid">
        <div class="detail-item">
          <strong>${escapeHtml(t("broadcast"))}</strong>
          <span>${escapeHtml(`${dayLabel(entry.schedule.day_of_week)} ${formatDisplayTime(entry.schedule.time)}`)}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("date"))}</strong>
          <span>${escapeHtml(formatDisplayDate(entry.schedule.date))}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("season"))}</strong>
          <span>${escapeHtml(formatSeason(entry))}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("plannedEpisodes"))}</strong>
          <span>${escapeHtml(totalEpisodeLabel(entry))}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("source"))}</strong>
          <span>${escapeHtml(entry.extensions?.source_material || "-")}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("studios"))}</strong>
          <span>${studios.length ? renderStudioFavoriteChips(studios, studioFavorites) : "-"}</span>
        </div>
      </div>
      <div class="detail-links">
        ${renderLinkButton(entry.source_links?.official, t("official"))}
      </div>
      <div class="detail-pills">
        ${tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t("synopsis"))}</h3>
      <p>${escapeHtml(entry.extensions?.synopsis || t("noSynopsis"))}</p>
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t("staff"))}</h3>
      ${renderCreditsSection(
        staff.slice(0, 18),
        (item) => {
          const personId = canonicalPersonId(item.person_mal_id);
          const activeClass = personId && personFavorites.has(personId) ? "is-active" : "";
          if (!personId) {
            return `<span class="credit-chip">${escapeHtml(formatDisplayName(item.name_ja, item.name))} / ${escapeHtml(item.role || "-")}</span>`;
          }
          return `
            <span class="inline-chip-row detail-credit-row">
              <button class="credit-chip person-open-chip" type="button" data-open-person="${escapeHtml(personId)}">${escapeHtml(formatDisplayName(item.name_ja, item.name))} / ${escapeHtml(item.role || "-")}</button>
              <button class="credit-chip credit-toggle chip-favorite-btn ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}" aria-label="Toggle person favorite">★</button>
            </span>
          `;
        },
        t("noStaff"),
      )}
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t("cast"))}</h3>
      ${renderCreditsSection(
        characters.slice(0, 18),
        (item) => {
          const personId = canonicalPersonId(item.voice_actor_mal_id);
          const activeClass = personId && personFavorites.has(personId) ? "is-active" : "";
          if (!personId) {
            return `<span class="credit-chip">${escapeHtml(formatDisplayName(item.character_name_ja, item.character_name))} / ${escapeHtml(formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name))}</span>`;
          }
          return `
            <span class="inline-chip-row detail-credit-row">
              <button class="credit-chip person-open-chip" type="button" data-open-person="${escapeHtml(personId)}">${escapeHtml(formatDisplayName(item.character_name_ja, item.character_name))} / ${escapeHtml(formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name))}</button>
              <button class="credit-chip credit-toggle chip-favorite-btn ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}" aria-label="Toggle person favorite">★</button>
            </span>
          `;
        },
        t("noCast"),
      )}
    </section>
    <section class="detail-section">
      <div class="detail-grid">
        <div class="detail-item">
          <strong>${escapeHtml(t("score"))}</strong>
          <span>${escapeHtml(entry.extensions?.score ?? "-")}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("rank"))}</strong>
          <span>${escapeHtml(entry.extensions?.rank ?? "-")}</span>
        </div>
        <div class="detail-item">
          <strong>${escapeHtml(t("popularity"))}</strong>
          <span>${escapeHtml(entry.extensions?.popularity ?? "-")}</span>
        </div>
      </div>
    </section>
  `;

  document.getElementById("detail-modal").classList.remove("hidden");
  document.getElementById("detail-modal").setAttribute("aria-hidden", "false");
  bringModalToFront("detail");
}

function closeModal(name) {
  const modal = document.getElementById(`${name}-modal`);
  if (!modal) {
    return;
  }
  if (name === "detail") {
    state.currentDetailEntryId = null;
  }
  if (name === "relation") {
    state.currentRelation = null;
  }
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  modal.style.zIndex = "";
}

function syncViewButtons() {
  const showScheduleTabs = state.viewMode === "board" || state.viewMode === "list";
  const showYearFilter = state.viewMode === "finished";
  const showSeasonFilter = state.viewMode === "finished" || (showScheduleTabs && state.scheduleStatus === "upcoming");
  const showMediaFilter = state.viewMode !== "movies";
  const showDayFilter = showScheduleTabs;
  const showToolbarFilters = showYearFilter || showSeasonFilter || showMediaFilter;
  document.getElementById("view-board").classList.toggle("is-active", state.viewMode === "board");
  document.getElementById("view-list").classList.toggle("is-active", state.viewMode === "list");
  document.getElementById("view-movies").classList.toggle("is-active", state.viewMode === "movies");
  document.getElementById("view-finished").classList.toggle("is-active", state.viewMode === "finished");
  document.getElementById("status-airing").classList.toggle("is-active", state.scheduleStatus === "airing");
  document.getElementById("status-upcoming").classList.toggle("is-active", state.scheduleStatus === "upcoming");
  document.getElementById("movie-now").classList.toggle("is-active", state.movieTab === "now");
  document.getElementById("movie-upcoming").classList.toggle("is-active", state.movieTab === "upcoming");
  document.getElementById("board-view").classList.toggle("hidden", state.viewMode !== "board");
  document.getElementById("list-view").classList.toggle("hidden", state.viewMode !== "list");
  document.getElementById("movie-view").classList.toggle("hidden", state.viewMode !== "movies");
  document.getElementById("finished-view").classList.toggle("hidden", state.viewMode !== "finished");
  document.getElementById("search-results").classList.toggle("hidden", !state.search);
  document.getElementById("schedule-tabs").classList.toggle("hidden", !showScheduleTabs);
  document.getElementById("day-filters").classList.toggle("hidden", !showDayFilter);
  document.getElementById("movie-tabs").classList.toggle("hidden", state.viewMode !== "movies");
  document.getElementById("toolbar-filters").classList.toggle("hidden", !showToolbarFilters);
  document.getElementById("year-filter-wrap").classList.toggle("hidden", !showYearFilter);
  document.getElementById("season-filters").classList.toggle("hidden", !showSeasonFilter);
  document.getElementById("media-filters").classList.toggle("hidden", !showMediaFilter);
}

function render() {
  const detailModal = document.getElementById("detail-modal");
  const relationModal = document.getElementById("relation-modal");
  const modalOrder = [];
  if (state.currentDetailEntryId && detailModal && !detailModal.classList.contains("hidden")) {
    modalOrder.push({
      name: "detail",
      zIndex: Number(detailModal.style.zIndex || 30),
    });
  }
  if (state.currentRelation && relationModal && !relationModal.classList.contains("hidden")) {
    modalOrder.push({
      name: "relation",
      zIndex: Number(relationModal.style.zIndex || 30),
    });
  }
  modalOrder.sort((left, right) => left.zIndex - right.zIndex);

  const activeEntries = getActiveEntries();
  const movieEntries = getMovieEntries();
  const finishedMatches = getFinishedSearchMatches();
  const searchResults = getGlobalSearchResults();
  persistUiState();
  updateStaticText();
  renderDayFilters();
  renderYearFilter();
  renderSeasonFilters();
  renderMediaFilters();
  renderFavoriteScopeFilters();
  renderSummaryStrip(activeEntries, finishedMatches);
  renderBoard(activeEntries);
  renderList(activeEntries);
  renderMovieView(movieEntries);
  renderFinishedView(finishedMatches);
  renderSearchResults(searchResults);
  renderFavoritesModal();
  syncViewButtons();
  for (const modalInfo of modalOrder) {
    if (modalInfo.name === "detail" && state.currentDetailEntryId) {
      openDetailModal(state.currentDetailEntryId);
      continue;
    }
    if (modalInfo.name === "relation" && state.currentRelation) {
      if (state.currentRelation.type === "person") {
        openPersonModal(state.currentRelation.id);
      } else if (state.currentRelation.type === "studio") {
        openStudioModal(state.currentRelation.id);
      }
    }
  }
}

function toggleFavorite(key) {
  const favorites = getFavoriteSet();
  if (favorites.has(key)) {
    favorites.delete(key);
  } else {
    favorites.add(key);
  }
  saveFavoriteSet(favorites);
  render();
}

function togglePersonFavorite(personId) {
  const normalizedId = canonicalPersonId(personId);
  if (!normalizedId) {
    return;
  }
  const favorites = getPersonFavoriteSet();
  if (favorites.has(normalizedId)) {
    favorites.delete(normalizedId);
  } else {
    favorites.add(normalizedId);
  }
  savePersonFavoriteSet(favorites);
  render();
}

function toggleStudioFavorite(studioName) {
  const normalizedName = String(studioName || "").trim();
  if (!normalizedName) {
    return;
  }
  const favorites = getStudioFavoriteSet();
  if (favorites.has(normalizedName)) {
    favorites.delete(normalizedName);
  } else {
    favorites.add(normalizedName);
  }
  saveStudioFavoriteSet(favorites);
  render();
}

function renderFatal(message) {
  document.getElementById("board-view").innerHTML = renderEmpty(message);
  document.getElementById("list-view").innerHTML = "";
  document.getElementById("movie-view").innerHTML = "";
  document.getElementById("finished-view").innerHTML = "";
  document.getElementById("search-results").innerHTML = "";
}

function toggleLanguage() {
  state.lang = state.lang === "ko" ? "en" : "ko";
  localStorage.setItem(LANG_STORAGE_KEY, state.lang);
  render();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, state.theme);
  render();
}

function bindEvents() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("compositionstart", () => {
    searchComposing = true;
  });

  searchInput.addEventListener("compositionend", (event) => {
    searchComposing = false;
    state.searchDraft = event.target.value;
    queueSearchCommit();
  });

  searchInput.addEventListener("input", (event) => {
    state.searchDraft = event.target.value;
    if (searchComposing) {
      return;
    }
    queueSearchCommit();
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    state.searchDraft = event.target.value;
    commitSearchDraft();
  });

  document.getElementById("favorites-only").addEventListener("change", (event) => {
    state.favoritesOnly = event.target.checked;
    render();
  });

  document.getElementById("hero-title").addEventListener("click", () => {
    state.viewMode = "board";
    state.scheduleStatus = "airing";
    state.selectedDay = "ALL";
    state.selectedSeason = "ALL";
    state.selectedYear = "ALL";
    state.selectedMedia = [];
    state.search = "";
    state.searchDraft = "";
    state.favoritesOnly = false;
    clearSearchCommitTimer();
    localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    render();
  });

  document.getElementById("favorite-scope-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite-scope]");
    if (!button) {
      return;
    }
    const scope = button.dataset.favoriteScope;
    if (!FAVORITE_SCOPE_ORDER.includes(scope)) {
      return;
    }
    if (state.selectedFavoriteScopes.includes(scope)) {
      if (state.selectedFavoriteScopes.length === 1) {
        return;
      }
      state.selectedFavoriteScopes = state.selectedFavoriteScopes.filter((item) => item !== scope);
    } else {
      state.selectedFavoriteScopes = [...state.selectedFavoriteScopes, scope];
    }
    render();
  });

  document.getElementById("lang-toggle").addEventListener("click", toggleLanguage);
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  document.getElementById("year-filter").addEventListener("change", (event) => {
    state.selectedYear = event.target.value;
    render();
  });

  document.getElementById("view-board").addEventListener("click", () => {
    state.viewMode = "board";
    localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    render();
  });

  document.getElementById("view-list").addEventListener("click", () => {
    state.viewMode = "list";
    localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    render();
  });

  document.getElementById("view-movies").addEventListener("click", () => {
    state.viewMode = "movies";
    localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    render();
  });

  document.getElementById("view-finished").addEventListener("click", () => {
    state.viewMode = "finished";
    ensureFinishedYearSelection();
    localStorage.setItem(VIEW_STORAGE_KEY, state.viewMode);
    render();
  });

  document.getElementById("movie-now").addEventListener("click", () => {
    state.movieTab = "now";
    render();
  });

  document.getElementById("movie-upcoming").addEventListener("click", () => {
    state.movieTab = "upcoming";
    render();
  });

  document.getElementById("status-airing").addEventListener("click", () => {
    state.scheduleStatus = "airing";
    render();
  });

  document.getElementById("status-upcoming").addEventListener("click", () => {
    state.scheduleStatus = "upcoming";
    render();
  });

  document.getElementById("day-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-day]");
    if (!button) {
      return;
    }
    state.selectedDay = button.dataset.day;
    render();
  });

  document.getElementById("season-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-season]");
    if (!button) {
      return;
    }
    state.selectedSeason = button.dataset.season;
    render();
  });

  document.getElementById("media-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-media]");
    if (!button) {
      return;
    }
    const media = button.dataset.media;
    if (media === "ALL") {
      state.selectedMedia = [];
      render();
      return;
    }
    if (state.selectedMedia.includes(media)) {
      state.selectedMedia = state.selectedMedia.filter((item) => item !== media);
    } else {
      state.selectedMedia = [...state.selectedMedia, media];
    }
    render();
  });

  document.body.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite-key]");
    if (favoriteButton) {
      toggleFavorite(favoriteButton.dataset.favoriteKey);
      return;
    }

    const personFavoriteButton = event.target.closest("[data-person-favorite-id]");
    if (personFavoriteButton) {
      togglePersonFavorite(personFavoriteButton.dataset.personFavoriteId);
      return;
    }

    const studioFavoriteButton = event.target.closest("[data-studio-favorite-name]");
    if (studioFavoriteButton) {
      toggleStudioFavorite(studioFavoriteButton.dataset.studioFavoriteName);
      return;
    }

    const detailButton = event.target.closest("[data-open-details]");
    if (detailButton) {
      openDetailModal(detailButton.dataset.openDetails);
      return;
    }

    const personButton = event.target.closest("[data-open-person]");
    if (personButton) {
      openPersonModal(personButton.dataset.openPerson);
      return;
    }

    const studioButton = event.target.closest("[data-open-studio]");
    if (studioButton) {
      openStudioModal(studioButton.dataset.openStudio);
      return;
    }

    const relationMoreButton = event.target.closest("[data-relation-more-works]");
    if (relationMoreButton) {
      const relationType = relationMoreButton.dataset.relationType;
      const relationId = relationMoreButton.dataset.relationMoreWorks;
      const currentCount = Number(state.currentRelation?.visibleWorkCount || DEFAULT_RELATION_WORK_LIMIT);
      state.currentRelation = {
        ...(state.currentRelation || {}),
        type: relationType,
        id: relationId,
        visibleWorkCount: currentCount + RELATION_WORK_INCREMENT,
      };
      if (relationType === "person") {
        openPersonModal(relationId);
      } else if (relationType === "studio") {
        openStudioModal(relationId);
      }
      return;
    }

    if (event.target.closest("#open-favorites")) {
      document.getElementById("favorites-modal").classList.remove("hidden");
      document.getElementById("favorites-modal").setAttribute("aria-hidden", "false");
      bringModalToFront("favorites");
      return;
    }

    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
      closeModal(closeButton.dataset.closeModal);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStaticText();
  bindEvents();
  syncViewButtons();
  loadData();
});
