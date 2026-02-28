import { getShopItems, shopItems } from './shop-items.js';
import { initFavoriteButtons } from './products.js';

// ================= SHOP PRODUCTS RENDERING =================
// This file contains functions to render products dynamically in HTML

/**
 * Render product grid HTML
 * @param {Array} items - Array of product items to render
 * @param {String} containerId - ID of the container element
 */
function renderProductGrid(items, containerId = 'productGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="search-no-results">No products found.</div>';
    return;
  }

  const productsHTML = items.map(item => createProductCardHTML(item)).join('');
  container.innerHTML = productsHTML;

  // Initialize favorite buttons after rendering
  initFavoriteButtons();
}

/**
 * Create individual product card HTML
 * @param {Object} item - Product item object
 * @returns {String} HTML string for product card
 */
function createProductCardHTML(item) {
  return `
    <div class="product-card reveal"
      data-id="${item.id}"
      data-name="${item.name}"
      data-price="${item.price}"
      data-image="${item.image}"
      data-description="${item.description}"
      onclick="openProductDetail(this)">
      <button class="product-favorite-btn" onclick="event.stopPropagation(); addProductToFavorites(this)" aria-label="Add to favorites">
        <span class="material-symbols-outlined">favorite</span>
      </button>
      <img src="${item.image}" alt="${item.name}" />
      <div class="product-info">
        <h3>${item.name}</h3>
        <p class="product-price">$${item.price.toFixed(2)}</p>
        <div class="product-rating">
          <span class="product-stars">${createStarsHTML(item.rating)}</span>
          <span class="product-review-count">(${item.reviews})</span>
        </div>
        <div class="product-actions">
          <button type="button" class="btn-add-cart" onclick="event.stopPropagation(); addProductToCart(this)">Add to cart</button>
          <button type="button" class="btn-buy" onclick="event.stopPropagation(); buyProduct(this)">Buy</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create star rating HTML
 * @param {Number} rating - Rating value (0-5)
 * @returns {String} HTML string for stars
 */
function createStarsHTML(rating) {
  let starsHTML = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<span class="material-symbols-outlined filled">star</span>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<span class="material-symbols-outlined half">star_half</span>';
    } else {
      starsHTML += '<span class="material-symbols-outlined">star</span>';
    }
  }

  return starsHTML;
}

/**
 * Render category showcase with products
 * @param {String} category - Category name (men, women, accessories)
 * @param {String} containerId - ID of the container
 */
function renderCategoryProducts(category, containerId = 'categoryProducts') {
  const items = getShopItems(category);
  const container = document.getElementById(containerId);

  if (!container) return;

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  const sectionHTML = `
    <section class="section reveal">
      <h2 class="section-title">Shop ${categoryTitle}</h2>
      <div class="product-grid" id="categoryGrid">
        ${items.map(item => createProductCardHTML(item)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = sectionHTML;
  initFavoriteButtons();
}

export {
  renderProductGrid,
  createProductCardHTML,
  createStarsHTML,
  renderCategoryProducts
};

