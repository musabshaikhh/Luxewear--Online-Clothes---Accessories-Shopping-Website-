import { addToCart } from './cart.js';
import { getFavorites, saveFavorites } from './favorites.js';
import { renderProductReviews, updateProductRatings } from './reviews.js';
import { showNotification } from './utils.js';

// ================= PRODUCT DETAIL MODAL =================
window.currentDetailProductId = null;
window.selectedRating = 0;

function openProductDetail(element) {
  const id = element.dataset.id;
  const name = element.dataset.name;
  const price = element.dataset.price;
  const image = element.dataset.image;
  const description = element.dataset.description || 'Premium quality product with excellent craftsmanship and materials.';

  window.currentDetailProductId = id;
  window.selectedRating = 0;

  document.getElementById('detailProductImage').src = image;
  document.getElementById('detailProductName').textContent = name;
  document.getElementById('detailProductPrice').textContent = '$' + price;
  document.getElementById('detailDescription').textContent = description;
  document.getElementById('detailSize').value = 'M';
  document.getElementById('detailQuantity').value = 1;

  document.getElementById('reviewForm').reset();
  document.getElementById('selectedRating').value = 0;
  updateRatingStars(0);

  renderProductReviews(id);
  updateProductRatings(id);

  const favorites = getFavorites();
  const isFav = favorites.some(f => f.id === id);
  updateFavButton(isFav);

  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if (overlay) overlay.classList.add('open');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if (overlay) overlay.classList.remove('open');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  window.currentDetailProductId = null;
}

function increaseDetailQty() {
  const qty = document.getElementById('detailQuantity');
  qty.value = parseInt(qty.value) + 1;
}

function decreaseDetailQty() {
  const qty = document.getElementById('detailQuantity');
  if (parseInt(qty.value) > 1) {
    qty.value = parseInt(qty.value) - 1;
  }
}

function addDetailProductToCart() {
  if (!window.currentDetailProductId) return;

  const detailName = document.getElementById('detailProductName').textContent;
  const detailPrice = parseFloat(document.getElementById('detailProductPrice').textContent.replace('$', ''));
  const detailImage = document.getElementById('detailProductImage').src;
  const qty = parseInt(document.getElementById('detailQuantity').value);

  const item = {
    id: window.currentDetailProductId,
    name: detailName,
    price: detailPrice,
    image: detailImage,
    qty: qty
  };

  addToCart(item);
  closeProductDetail();
}

function buyDetailProduct() {
  addDetailProductToCart();
  setTimeout(() => window.openCheckout(), 300);
}

function toggleDetailFavorite() {
  if (!window.currentDetailProductId) return;

  const detailName = document.getElementById('detailProductName').textContent;
  const detailPrice = parseFloat(document.getElementById('detailProductPrice').textContent.replace('$', ''));
  const detailImage = document.getElementById('detailProductImage').src;

  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === window.currentDetailProductId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    showNotification('Removed', `${detailName} removed from favorites`, 'info');
    updateFavButton(false);
  } else {
    favorites.push({
      id: window.currentDetailProductId,
      name: detailName,
      price: detailPrice,
      image: detailImage
    });
    showNotification('Added', `${detailName} added to favorites`, 'success');
    updateFavButton(true);
  }

  saveFavorites(favorites);
}

function updateFavButton(isFavorite) {
  const btn = document.getElementById('favBtn');
  if (!btn) return;

  if (isFavorite) {
    btn.classList.add('is-favorite');
    btn.innerHTML = '<span class="material-symbols-outlined">favorite</span> Remove from Favorites';
  } else {
    btn.classList.remove('is-favorite');
    btn.innerHTML = '<span class="material-symbols-outlined">favorite</span> Add to Favorites';
  }
}

function initFavoriteButtons() {
  const favorites = getFavorites();
  const favoriteIds = favorites.map(f => f.id);
  const favBtns = document.querySelectorAll('.product-favorite-btn');

  favBtns.forEach(btn => {
    const card = btn.closest('.product-card');
    if (card && favoriteIds.includes(card.dataset.id)) {
      btn.classList.add('is-favorited');
    }
  });
}

export {
  openProductDetail,
  closeProductDetail,
  increaseDetailQty,
  decreaseDetailQty,
  addDetailProductToCart,
  buyDetailProduct,
  toggleDetailFavorite,
  updateFavButton,
  initFavoriteButtons
};
