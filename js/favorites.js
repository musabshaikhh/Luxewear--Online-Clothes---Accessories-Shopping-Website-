import { showNotification } from './utils.js';

// ================= FAVORITES SIDEBAR =================
const FAVORITES_KEY = 'luxewear_favorites';

function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function openFavorites() {
  const overlay = document.getElementById('favoritesOverlay');
  const sidebar = document.getElementById('favoritesSidebar');
  if (overlay) overlay.classList.add('open');
  if (sidebar) sidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderFavorites();
}

function closeFavorites() {
  const overlay = document.getElementById('favoritesOverlay');
  const sidebar = document.getElementById('favoritesSidebar');
  if (overlay) overlay.classList.remove('open');
  if (sidebar) sidebar.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleFavorites() {
  const sidebar = document.getElementById('favoritesSidebar');
  if (sidebar && sidebar.classList.contains('open')) closeFavorites();
  else openFavorites();
}

function renderFavorites() {
  const favorites = getFavorites();
  const container = document.getElementById('favoritesItems');
  const emptyEl = document.getElementById('favoritesEmpty');
  if (!container) return;

  container.innerHTML = '';
  if (favorites.length === 0) {
    if (emptyEl) emptyEl.classList.add('show');
    return;
  }
  if (emptyEl) emptyEl.classList.remove('show');

  favorites.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    div.innerHTML = `
      <img class="favorite-item-img" src="${item.image || ''}" alt="${item.name || 'Item'}">
      <div class="favorite-item-details">
        <div class="favorite-item-name">${item.name || 'Product'}</div>
        <div class="favorite-item-price">$${(item.price || 0).toFixed(2)}</div>
      </div>
      <button type="button" class="favorite-item-remove" onclick="window.removeFromFavorites(${index})" aria-label="Remove from favorites">
        <span class="material-symbols-outlined">delete</span>
      </button>
    `;
    container.appendChild(div);
  });
}

function removeFromFavorites(index) {
  const favorites = getFavorites();
  favorites.splice(index, 1);
  saveFavorites(favorites);
  renderFavorites();
}

function addToFavorites(item) {
  const favorites = getFavorites();
  const existing = favorites.find(x => x.id === item.id);
  if (!existing) {
    favorites.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    saveFavorites(favorites);
  }
}

function addProductToFavorites(btn) {
  event.stopPropagation();
  const card = btn.closest('.product-card');
  if (!card) return;

  const favorites = getFavorites();
  const productId = card.dataset.id;
  const productName = card.dataset.name;
  const productPrice = parseFloat(card.dataset.price) || 0;
  const productImage = card.dataset.image || '';

  const existingIndex = favorites.findIndex(f => f.id === productId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    btn.classList.remove('is-favorited');
    showNotification('Removed', `${productName} removed from favorites`, 'info');
  } else {
    favorites.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage
    });
    btn.classList.add('is-favorited');
    showNotification('Added', `${productName} added to favorites`, 'success');
  }

  saveFavorites(favorites);
}

export {
  getFavorites,
  saveFavorites,
  openFavorites,
  closeFavorites,
  toggleFavorites,
  renderFavorites,
  removeFromFavorites,
  addToFavorites,
  addProductToFavorites
};
