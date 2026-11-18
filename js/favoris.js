(() => {
"use strict";
const app = window.GameExplorer;
const grid = document.getElementById("favoritesGrid");
const empty = document.getElementById("favoritesEmpty");
const search = document.getElementById("favoriteSearch");
const form = document.getElementById("favoriteSearchForm");
const sort = document.getElementById("favoriteSort");
const clear = document.getElementById("clearFavorites");
const count = document.getElementById("favoriteResultCount");
const feedback = document.getElementById("favoriteFeedback");
if (!app || !grid) return;

function renderFavorites() {
  const all = app.favorites();
  const term = search.value.trim().toLocaleLowerCase();
  const filtered = all.filter(game => game.name.toLocaleLowerCase().includes(term));
  if (sort.value === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));
  else if (sort.value === "rating") filtered.sort((a,b) => b.rating-a.rating);
  else filtered.sort((a,b) => b.savedAt-a.savedAt);
  const fragment = document.createDocumentFragment();
  filtered.forEach(game => fragment.append(app.createGameCard(game)));
  grid.replaceChildren(fragment);
  empty.hidden = all.length !== 0;
  clear.disabled = all.length === 0;
  count.textContent = all.length + " saved " + (all.length===1?"game":"games") +
    (term ? " · " + filtered.length + " matching your search" : "");
  feedback.textContent = all.length && !filtered.length ? "No saved games match this search." : "";
  feedback.hidden = !feedback.textContent;
  app.updateFavoriteCount();
}
form.addEventListener("submit",event => {event.preventDefault();renderFavorites();});
search.addEventListener("input",renderFavorites);
sort.addEventListener("change",renderFavorites);
clear.addEventListener("click",() => {
  const saved = app.favorites();
  if (!saved.length) return;
  if (!confirm("Remove all " + saved.length + " saved games from your favorites?")) return;
  try {
    localStorage.removeItem("likes");
    window.dispatchEvent(new Event("favorites:changed"));
    renderFavorites();
  } catch (error) {
    feedback.textContent = "Could not clear favorites. Check browser storage settings.";
    feedback.hidden = false;
  }
});
window.addEventListener("favorites:changed",renderFavorites);
window.addEventListener("favorites:external-change",renderFavorites);
renderFavorites();
})();