(() => {
"use strict";
const app = window.GameExplorer;
const container = document.getElementById("detailContent");
const feedback = document.getElementById("detailFeedback");
if (!app || !container || !feedback) return;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = String(text);
  return node;
}
function showMessage(message, error=false) {
  feedback.hidden = !message;
  feedback.textContent = message;
  feedback.classList.toggle("is-error",error);
}
function externalUrl(url) {
  try {
    const parsed = new URL(url);
    return ["https:","http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch (_) { return null; }
}
function renderDetails(raw, fallback=false) {
  const game = app.normalizeGame(raw);
  if (!game.id) { showMessage("Game data is unavailable.",true); return; }
  container.replaceChildren();
  const layout = element("div","detail-head");
  const image = document.createElement("img");
  image.className = "detail-cover";
  image.src = game.img || app.fallbackImage;
  image.alt = "Cover art for " + game.name;
  image.addEventListener("error",() => {
    if (!image.src.endsWith("/images/not_fond.png")) image.src = app.fallbackImage;
  });
  const info = element("div","detail-info");
  info.append(element("p","eyebrow","GAME DETAILS"),element("h1","",game.name));
  const rating = element("p","detail-rating",game.rating
    ? "★ " + game.rating.toFixed(1) + " / 5" : "Not rated yet");
  const meta = element("div","detail-meta");
  meta.append(element("span","","Released: " + (game.released || "Unknown")),
    element("span","","Last updated: " + (game.updated || "Unknown")));
  const platforms = element("div","detail-platforms");
  const names = app.platformNames(raw);
  names.forEach(name => platforms.append(element("span","platform-chip",name)));
  const actions = element("div","detail-actions");
  const favorite = element("button","primary-button");
  favorite.type = "button";
  function refreshFavoriteButton() {
    const liked = app.isFavorite(game.id);
    favorite.textContent = liked ? "♥ Remove from Favorites" : "♡ Add to Favorites";
    favorite.setAttribute("aria-pressed",String(liked));
  }
  refreshFavoriteButton();
  favorite.addEventListener("click",() => {
    try { app.toggleFavorite(raw);refreshFavoriteButton(); }
    catch (error) { alert("Could not update favorites. Check browser storage settings."); }
  });
  actions.append(favorite);
  const reddit = externalUrl(game.reddit_url);
  if (reddit) {
    const link = element("a","secondary-button","Reddit ↗");
    link.href = reddit; link.target = "_blank"; link.rel = "noopener noreferrer";
    actions.append(link);
  }
  const rawgSlug = raw?.slug;
  if (typeof rawgSlug === "string" && rawgSlug) {
    const rawg = element("a","secondary-button","View on RAWG ↗");
    rawg.href = "https://rawg.io/games/" + encodeURIComponent(rawgSlug);
    rawg.target = "_blank"; rawg.rel = "noopener noreferrer";
    actions.append(rawg);
  }
  info.append(rating,meta,platforms,actions);
  layout.append(image,info);
  const descriptionBlock = element("section","detail-description");
  descriptionBlock.append(element("h2","","About this game"));
  const description = game.description || "A description is not available for this game.";
  const text = element("p","");
  const expand = element("button","secondary-button","Read more");
  const shortened = description.length > 530;
  let expanded = false;
  function updateDescription() {
    text.textContent = shortened && !expanded ? description.slice(0,530).trimEnd() + "…" : description;
    expand.textContent = expanded ? "Read less" : "Read more";
    expand.setAttribute("aria-expanded",String(expanded));
  }
  updateDescription();
  descriptionBlock.append(text);
  if (shortened) {
    expand.addEventListener("click",() => {expanded=!expanded;updateDescription();});
    descriptionBlock.append(expand);
  }
  container.append(layout,descriptionBlock);
  container.hidden = false;
  showMessage(fallback ? "RAWG is unavailable right now. Showing saved game information." : "");
}
async function load() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let cached = null;
  try {
    const lastGame = JSON.parse(localStorage.getItem("details") || "null");
    if (lastGame?.id != null && (!id || String(lastGame.id)===id)) cached = lastGame;
  } catch (_) {}
  if (!cached && id) cached = app.favorites().find(g => g.id === id) || null;
  if (!id) {
    if (cached) renderDetails(cached,true);
    else showMessage("No game selected. Return to the catalog and choose a game.",true);
    return;
  }
  showMessage("Loading game details…");
  try {
    const data = await app.fetchRawg("/games/" + encodeURIComponent(id));
    renderDetails(data);
    try { localStorage.setItem("details",JSON.stringify(app.normalizeGame(data))); } catch (_) {}
  } catch (error) {
    console.error("Unable to fetch game details:",error);
    if (cached) renderDetails(cached,true);
    else showMessage("Unable to load game details. Please try again from the catalog.",true);
  }
}
window.addEventListener("favorites:external-change", () => {
  // Update the favorite button when saved games change in another tab.
  const button = container.querySelector(".detail-actions .primary-button");
  if (!button) return;
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;
  const liked = app.isFavorite(id);
  button.textContent = liked ? "♥ Remove from Favorites" : "♡ Add to Favorites";
  button.setAttribute("aria-pressed",String(liked));
});
load();
})();