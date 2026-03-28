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
const LANG_STORAGE_KEY = "anime_calendar_lang";
const THEME_STORAGE_KEY = "anime_calendar_theme";
const UI_STATE_STORAGE_KEY = "anime_calendar_ui_state";

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
    searchLabel: "검색",
    searchPlaceholder: "제목, 스태프, 제작사 등 검색",
    favoritesOnly: "좋아요만 보기",
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
    searchLabel: "Search",
    searchPlaceholder: "Search titles, staff, studios...",
    favoritesOnly: "Favorites only",
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

const state = {
  dataset: null,
  entries: [],
  entryIndex: new Map(),
  peopleIndex: new Map(),
  currentDetailEntryId: null,
  viewMode: localStorage.getItem(VIEW_STORAGE_KEY) || "board",
  movieTab: savedUiState.movieTab || "now",
  scheduleStatus: savedUiState.scheduleStatus || "airing",
  selectedDay: savedUiState.selectedDay || "ALL",
  selectedYear: savedUiState.selectedYear || "ALL",
  selectedSeason: savedUiState.selectedSeason || "ALL",
  selectedMedia: normalizeSelectedMedia(savedUiState.selectedMedia),
  search: savedUiState.search || "",
  favoritesOnly: Boolean(savedUiState.favoritesOnly),
  activeCount: 0,
  finishedCount: 0,
  lang: localStorage.getItem(LANG_STORAGE_KEY) || "ko",
  theme: localStorage.getItem(THEME_STORAGE_KEY) || "light",
};

function persistUiState() {
  localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify({
    movieTab: state.movieTab,
    scheduleStatus: state.scheduleStatus,
    selectedDay: state.selectedDay,
    selectedYear: state.selectedYear,
    selectedSeason: state.selectedSeason,
    selectedMedia: state.selectedMedia,
    search: state.search,
    favoritesOnly: state.favoritesOnly,
  }));
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
    return new Set(JSON.parse(localStorage.getItem(PERSON_FAVORITES_STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function savePersonFavoriteSet(set) {
  localStorage.setItem(PERSON_FAVORITES_STORAGE_KEY, JSON.stringify([...set]));
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
  state.peopleIndex = new Map((((payload.indexes || {}).people) || []).map((person) => [String(person.id), person]));
  state.activeCount = state.entries.filter((entry) => !entry.finished && !isMovie(entry)).length;
  state.finishedCount = state.entries.filter((entry) => entry.finished && !isMovie(entry)).length;
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
  if (state.favoritesOnly && !favorites.has(entry.favorite_key)) {
    return false;
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

function matchesSearch(entry) {
  return !state.search || entry.search_text.includes(state.search.toLowerCase());
}

function matchesScheduleStatus(entry) {
  return state.scheduleStatus === "airing" ? statusPriority(entry) === 0 : statusPriority(entry) === 1;
}

function getYearOptions() {
  return [...new Set(
    state.entries
      .map((entry) => entry.season?.year)
      .filter(Boolean)
      .map((year) => String(year)),
  )].sort((left, right) => Number(right) - Number(left));
}

function getActiveEntries() {
  const favorites = getFavoriteSet();
  return state.entries
    .filter((entry) => !entry.finished && !isMovie(entry) && matchesScheduleStatus(entry) && matchesBaseFilters(entry, favorites) && matchesSearch(entry))
    .sort(compareEntries);
}

function getFinishedSearchMatches() {
  const favorites = getFavoriteSet();
  return state.entries
    .filter((entry) => entry.finished && !isMovie(entry) && matchesBaseFilters(entry, favorites, { ignoreDayFilter: true }) && matchesSearch(entry))
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
  return state.entries.filter(matchesSearch).sort(compareGlobalSearchResults);
}

function getMovieEntries() {
  const favorites = getFavoriteSet();
  return state.entries
    .filter((entry) => {
      if (!isMovie(entry) || entry.finished) {
        return false;
      }
      if (!matchesBaseFilters(entry, favorites, { ignoreDayFilter: true })) {
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
  document.getElementById("favorites-eyebrow").textContent = t("favorites");
  document.getElementById("favorites-title").textContent = t("favoritesTitle");
  document.getElementById("favorites-close").textContent = t("close");
  document.getElementById("detail-close").textContent = t("close");
  document.getElementById("lang-toggle").textContent = state.lang === "ko" ? "EN" : "KO";
  document.getElementById("total-count").textContent = String(state.activeCount || 0);
  document.getElementById("finished-total").textContent = String(state.finishedCount || 0);
  document.getElementById("search-input").value = state.search;
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
  target.innerHTML = [
    `<option value="ALL">${escapeHtml(t("allYears"))}</option>`,
    ...getYearOptions().map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`),
  ].join("");
  target.value = state.selectedYear;
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
  const isFavorite = favorites.has(entry.favorite_key);
  const episodeLabel = currentEpisodeLabel(entry);
  const variant = options.variant || (options.finished ? "finished" : "default");
  const isExpandedList = Boolean(options.expandedList);
  const tags = [
    `<span class="pill">${escapeHtml(formatMediaType(entry))}</span>`,
    variant !== "movie" && entry.broadcasters?.network ? `<span class="pill">${escapeHtml(entry.broadcasters.network)}</span>` : "",
    `<span class="pill">${escapeHtml(formatStatus(entry))}</span>`,
    variant === "default" && statusPriority(entry) === 1 ? `<span class="pill is-accent">${escapeHtml(formatSeasonShort(entry))}</span>` : "",
    variant === "finished" ? `<span class="pill">${escapeHtml(formatSeasonCompact(entry))}</span>` : "",
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
    const personId = type === "cast" ? String(item.voice_actor_mal_id || "") : String(item.person_mal_id || "");
    const label = type === "cast"
      ? `${formatDisplayName(item.character_name_ja, item.character_name)} / ${formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name)}`
      : `${formatDisplayName(item.name_ja, item.name)} / ${item.role || "-"}`;
    if (!personId) {
      return `<span class="credit-chip person-inline-chip">${escapeHtml(label)}</span>`;
    }
    const activeClass = favoriteSet.has(personId) ? "is-active" : "";
    return `<button class="credit-chip credit-toggle person-inline-chip ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}">${escapeHtml(label)}</button>`;
  }).join("");

  return `<span class="person-inline-list">${markup}</span>`;
}

function renderListAnimeCard(entry) {
  const favorites = getFavoriteSet();
  const personFavorites = getPersonFavoriteSet();
  const isFavorite = favorites.has(entry.favorite_key);
  const episodeLabel = currentEpisodeLabel(entry);
  const metaTags = [
    `<span class="pill">${escapeHtml(formatMediaType(entry))}</span>`,
    entry.broadcasters?.network ? `<span class="pill">${escapeHtml(entry.broadcasters.network)}</span>` : "",
    `<span class="pill">${escapeHtml(formatStatus(entry))}</span>`,
    statusPriority(entry) === 1 ? `<span class="pill is-accent">${escapeHtml(formatSeasonShort(entry))}</span>` : "",
  ].filter(Boolean).join("");
  const genrePills = (entry.tags || []).slice(0, 6).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
  const studioSummary = (entry.extensions?.studios || []).slice(0, 2).join(" / ");
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
        ${studioSummary ? `<div class="detail-inline"><strong>${escapeHtml(t("studios"))}</strong><span>${escapeHtml(studioSummary)}</span></div>` : ""}
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

  if (!entries.length) {
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

  target.innerHTML = `<div class="board-grid ${visibleDays.length < 7 ? "compact" : ""}">${columns}</div>`;
}

function renderList(entries) {
  const target = document.getElementById("list-view");
  if (!entries.length) {
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

  target.innerHTML = `<div class="list-wrap">${groups}</div>`;
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
  if (!entries.length) {
    target.innerHTML = renderEmpty(t("noFinished"));
    return;
  }

  target.innerHTML = `
    <div class="search-wrap">
      <section class="search-group">
        <div class="search-head">
          <h2>${escapeHtml(t("finishedSearchTitle"))}</h2>
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
  const items = state.entries.filter((entry) => favorites.has(entry.favorite_key)).sort(compareEntries);
  const people = [...personFavorites]
    .map((personId) => state.peopleIndex.get(String(personId)))
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

function renderCreditsSection(items, formatter, emptyText) {
  if (!items.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }
  return `<div class="detail-credit-list">${items.map(formatter).join("")}</div>`;
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
          <span>${escapeHtml(studios.join(", ") || "-")}</span>
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
          const personId = String(item.person_mal_id || "");
          const activeClass = personId && personFavorites.has(personId) ? "is-active" : "";
          if (!personId) {
            return `<span class="credit-chip">${escapeHtml(formatDisplayName(item.name_ja, item.name))} / ${escapeHtml(item.role || "-")}</span>`;
          }
          return `<button class="credit-chip credit-toggle ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}">${escapeHtml(formatDisplayName(item.name_ja, item.name))} / ${escapeHtml(item.role || "-")}</button>`;
        },
        t("noStaff"),
      )}
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t("cast"))}</h3>
      ${renderCreditsSection(
        characters.slice(0, 18),
        (item) => {
          const personId = String(item.voice_actor_mal_id || "");
          const activeClass = personId && personFavorites.has(personId) ? "is-active" : "";
          if (!personId) {
            return `<span class="credit-chip">${escapeHtml(formatDisplayName(item.character_name_ja, item.character_name))} / ${escapeHtml(formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name))}</span>`;
          }
          return `<button class="credit-chip credit-toggle ${activeClass}" type="button" data-person-favorite-id="${escapeHtml(personId)}">${escapeHtml(formatDisplayName(item.character_name_ja, item.character_name))} / ${escapeHtml(formatDisplayName(item.voice_actor_name_ja, item.voice_actor_name))}</button>`;
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
}

function closeModal(name) {
  const modal = document.getElementById(`${name}-modal`);
  if (!modal) {
    return;
  }
  if (name === "detail") {
    state.currentDetailEntryId = null;
  }
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
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
  renderSummaryStrip(activeEntries, finishedMatches);
  renderBoard(activeEntries);
  renderList(activeEntries);
  renderMovieView(movieEntries);
  renderFinishedView(finishedMatches);
  renderSearchResults(searchResults);
  renderFavoritesModal();
  syncViewButtons();
  const detailModal = document.getElementById("detail-modal");
  if (state.currentDetailEntryId && detailModal && !detailModal.classList.contains("hidden")) {
    openDetailModal(state.currentDetailEntryId);
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
  const normalizedId = String(personId || "");
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
  document.getElementById("search-input").addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    render();
  });

  document.getElementById("favorites-only").addEventListener("change", (event) => {
    state.favoritesOnly = event.target.checked;
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

    const detailButton = event.target.closest("[data-open-details]");
    if (detailButton) {
      openDetailModal(detailButton.dataset.openDetails);
      return;
    }

    if (event.target.closest("#open-favorites")) {
      document.getElementById("favorites-modal").classList.remove("hidden");
      document.getElementById("favorites-modal").setAttribute("aria-hidden", "false");
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
