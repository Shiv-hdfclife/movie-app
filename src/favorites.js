// src/favorites.js

const KEY = "movie-favorites";

export function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toggleFavorite(movie) {
  let favs = loadFavorites();
  const index = favs.findIndex((m) => m.id === movie.id);
  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(movie);
  }
  saveFavorites(favs);
  return favs;
}
