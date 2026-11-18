(() => {
"use strict";
const API_KEY = "e7cef097d7b447a8babd4c45651f0df4"; // Existing key preserved. Browser-side keys are public.
const BASE = "https://api.rawg.io/api";
const FAV_KEY = "likes"; // Preserve previously saved favorites.
const FALLBACK = "./images/not_fond.png";
const $ = (id) => document.getElementById(id);
const str = (value, fallback = "") => value == null ? fallback : String(value);
function plainText(input) {
  const text = str(input);
  return text.includes("<") ? new DOMParser().parseFromString(text, "text/html").body.textContent || "" : text;
}
function platformNames(game) {
  if (typeof game?.platforms === "string") return game.platforms.split(",").map(s => s.trim()).filter(Boolean);
  const list = Array.isArray(game?.parent_platforms) && game.parent_platforms.length
    ? game.parent_platforms : (Array.isArray(game?.platforms) ? game.platforms : []);
  return [...new Set(list.map(x => str(x?.platform?.name || x?.name)).filter(Boolean))];
}
function normalizeGame(game) {
  return {
    id: str(game?.id), name: str(game?.name, "Unknown game"),
    img: str(game?.background_image || game?.img),
    rating: Number(game?.rating) || 0,
    released: str(game?.released), updated: str(game?.updated || game?.update),
    description: plainText(game?.description_raw || game?.description),
    reddit_url: str(game?.reddit_url || game?.reddit),
    platforms: platformNames(game).join(","),
    savedAt: Number(game?.savedAt) || Date.now()
  };
}
function favorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    const unique = new Set();
    return saved.filter(g => g && g.id != null).map(normalizeGame).filter(g => {
      if (!g.id || unique.has(g.id)) return false;
      unique.add(g.id); return true;
    });
  } catch (error) {
    console.warn("Could not read favorites:", error);
    return [];
  }
}
const isFavorite = (id) => favorites().some(g => g.id === str(id));
function updateFavoriteCount() {
  const count = favorites().length;
  document.querySelectorAll("[data-favorites-count]").forEach(el => el.textContent = String(count));
}
function toggleFavorite(game) {
  const item = normalizeGame(game);
  if (!item.id) throw Error("Game ID is missing");
  const saved = favorites();
  const index = saved.findIndex(g => g.id === item.id);
  const liked = index < 0;
  if (liked) saved.unshift({...item, savedAt: Date.now()});
  else saved.splice(index, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(saved));
  updateFavoriteCount();
  window.dispatchEvent(new CustomEvent("favorites:changed", {detail:{id:item.id, liked}}));
  return liked;
}
function createGameCard(rawGame, onFavoriteChange) {
  const game = normalizeGame(rawGame);
  const card = document.createElement("article");
  card.className = "game-card";
  const bar = document.createElement("div");
  bar.className = "card-tools";
  const platforms = document.createElement("div");
  platforms.className = "platform-list";
  const names = platformNames(rawGame).slice(0, 3);
  (names.length ? names : ["Game"]).forEach(name => {
    const badge = document.createElement("span");
    badge.className = "platform-chip"; badge.textContent = name; platforms.append(badge);
  });
  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = "favorite-toggle";
  function updateHeart() {
    const liked = isFavorite(game.id);
    favoriteButton.classList.toggle("is-favorite", liked);
    favoriteButton.setAttribute("aria-pressed", String(liked));
    favoriteButton.setAttribute("aria-label", (liked ? "Remove " : "Add ") + game.name +
      (liked ? " from favorites" : " to favorites"));
    favoriteButton.textContent = liked ? "♥" : "♡";
  }
  updateHeart();
  favoriteButton.addEventListener("click", () => {
    try {
      const liked = toggleFavorite(game);
      updateHeart();
      if (typeof onFavoriteChange === "function") onFavoriteChange(game, liked);
    } catch (error) { alert("Unable to save favorites. Check browser storage settings."); }
  });
  bar.append(platforms, favoriteButton);
  const link = document.createElement("a");
  link.className = "game-link";
  link.href = "./details.html?id=" + encodeURIComponent(game.id);
  link.addEventListener("click", () => {
    try { localStorage.setItem("details", JSON.stringify(game)); } catch (_) {}
  });
  const image = document.createElement("img");
  image.src = game.img || FALLBACK; image.alt = "Cover art for " + game.name;
  image.loading = "lazy"; image.className = "game-cover";
  image.addEventListener("error", () => {
    if (!image.src.endsWith("/images/not_fond.png")) image.src = FALLBACK;
  });
  const info = document.createElement("div");
  info.className = "game-info";
  const heading = document.createElement("h3"); heading.textContent = game.name;
  const rating = document.createElement("p");
  rating.className = "game-rating";
  rating.textContent = "★ " + (game.rating ? game.rating.toFixed(1) + " / 5" : "Not rated");
  const date = document.createElement("p");
  date.className = "game-date";
  date.textContent = "Released: " + (game.released || "Unknown");
  info.append(heading, rating, date);
  link.append(image, info); card.append(bar, link);
  return card;
}
function setupSidebar() {
  const toggle = $("sidebar-btn"), close = $("sidebar-close");
  const sidebar = $("sidebar"), overlay = $("sidebar-overlay");
  if (!toggle || !close || !sidebar || !overlay) return;
  let oldFocus = null;
  function hide() {
    if (sidebar.hidden) return;
    sidebar.hidden = true; overlay.hidden = true;
    document.body.classList.remove("sidebar-open");
    toggle.setAttribute("aria-expanded","false");
    sidebar.setAttribute("aria-hidden","true");
    oldFocus?.focus();
  }
  function show() {
    oldFocus = document.activeElement;
    sidebar.hidden = false; overlay.hidden = false;
    document.body.classList.add("sidebar-open");
    toggle.setAttribute("aria-expanded","true");
    sidebar.setAttribute("aria-hidden","false");
    close.focus();
  }
  toggle.addEventListener("click", () => sidebar.hidden ? show() : hide());
  close.addEventListener("click",hide);
  overlay.addEventListener("click",hide);
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click",hide));
  document.addEventListener("keydown", e => {
    if (sidebar.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key !== "Tab") return;
    const focus = [...sidebar.querySelectorAll("a[href],button")];
    if (!focus.length) return;
    if (e.shiftKey && document.activeElement === focus[0]) {
      e.preventDefault(); focus[focus.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === focus[focus.length - 1]) {
      e.preventDefault(); focus[0].focus();
    }
  });
}
async function fetchRawg(path, params={}, signal) {
  const url = new URL(BASE + path);
  url.searchParams.set("key",API_KEY);
  Object.entries(params).forEach(([name,value]) => {
    if (value !== "" && value != null) url.searchParams.set(name,String(value));
  });
  const response = await fetch(url, {signal});
  if (!response.ok) throw Error("RAWG API returned HTTP " + response.status);
  return response.json();
}
window.GameExplorer = {
  favorites,isFavorite,toggleFavorite,createGameCard,setupSidebar,
  updateFavoriteCount,fetchRawg,normalizeGame,platformNames,plainText,fallbackImage:FALLBACK
};
setupSidebar();
updateFavoriteCount();
window.addEventListener("storage", event => {
  if (event.key === FAV_KEY) {
    updateFavoriteCount(); window.dispatchEvent(new Event("favorites:external-change"));
  }
});

const grid = $("gamesGrid");
if (!grid) return; // Shared utilities work on details and favorites pages, too.
const genre = $("genreSelect"), platform = $("platformSelect"), sort = $("sortSelect");
const search = $("searchInput"), form = $("searchForm"), reset = $("resetFilters");
const more = $("loadMore"), retry = $("retryLoad");
const feedback = $("catalogFeedback"), count = $("resultCount");
const query = new URLSearchParams(location.search);
function selectValid(select,value) {
  if (value && [...select.options].some(option => option.value === value)) select.value = value;
}
selectValid(genre,query.get("genre"));
selectValid(platform,query.get("platform"));
selectValid(sort,query.get("sort"));
search.value = query.get("q") || "";
const state = {genre:genre.value,platform:platform.value,sort:sort.value,
  search:search.value.trim(),page:0,hasMore:false};
let request = null, serial = 0, debounce = null;
function syncUrl() {
  const url = new URL(location.href);
  for (const [name,value] of [["genre",state.genre],["platform",state.platform],
    ["sort",state.sort==="-added"?"":state.sort],["q",state.search]]) {
    if (value) url.searchParams.set(name,value);
    else url.searchParams.delete(name);
  }
  history.replaceState(null,"",url.pathname+url.search+url.hash);
}
function message(text, isError=false) {
  feedback.textContent = text;
  feedback.classList.toggle("is-error",isError);
  feedback.hidden = !text;
}
async function loadGames(append=false) {
  const page = append ? state.page+1 : 1;
  request?.abort();
  const controller = new AbortController();
  request=controller;
  const current=++serial;
  if (!append) {grid.replaceChildren();state.page=0;state.hasMore=false;}
  more.hidden=true;retry.hidden=true;message("Loading games…");
  try {
    const data=await fetchRawg("/games",{
      page,page_size:20,genres:state.genre,parent_platforms:state.platform,
      ordering:state.sort,search:state.search
    },controller.signal);
    if (current!==serial) return;
    if (!Array.isArray(data.results)) throw Error("Unexpected RAWG API response");
    const frag=document.createDocumentFragment();
    data.results.forEach(game => frag.append(createGameCard(game)));
    grid.append(frag);
    state.page=page;state.hasMore=Boolean(data.next);
    more.hidden=!state.hasMore;
    count.textContent=data.count != null
      ? Number(data.count).toLocaleString()+" matching games"
      : grid.children.length+" games";
    message(grid.children.length?"":"No games found. Change your filters or reset them.");
  } catch(error) {
    if (error.name==="AbortError" || current!==serial) return;
    console.error("RAWG request failed:",error);
    message("Could not load games. Check your connection or RAWG API access, then retry.",true);
    retry.hidden=false;more.hidden=true;
  }
}
function apply() {
  state.genre=genre.value;state.platform=platform.value;
  state.sort=sort.value;state.search=search.value.trim();
  syncUrl();loadGames(false);
}
[genre,platform,sort].forEach(select => select.addEventListener("change",apply));
search.addEventListener("input",() => {
  clearTimeout(debounce);debounce=setTimeout(apply,350);
});
form.addEventListener("submit",event => {
  event.preventDefault();clearTimeout(debounce);apply();
});
reset.addEventListener("click",() => {
  genre.value="";platform.value="";sort.value="-added";search.value="";
  clearTimeout(debounce);apply();
});
more.addEventListener("click",()=>{if(state.hasMore)loadGames(true);});
retry.addEventListener("click",()=>loadGames(state.page>0));
loadGames();
})();