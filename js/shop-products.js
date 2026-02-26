import { getShopItems, getShopItemById, filterShopItemsByPrice, sortShopItems, searchShopItems, shopItems } from './shop-items.js';
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
 * Render featured products section
 * @param {Array} items - Array of featured items
 * @param {String} sectionTitle - Title for the section
 * @param {String} containerId - ID of the container
 */
function renderFeaturedProducts(items, sectionTitle = 'Featured Products', containerId = 'featuredProducts') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sectionHTML = `
    <section class="section reveal">
      <h2 class="section-title">${sectionTitle}</h2>
      <div class="product-grid" id="featuredGrid">
        ${items.map(item => createProductCardHTML(item)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = sectionHTML;
  initFavoriteButtons();
}

/**
 * Render product list (alternative to grid)
 * @param {Array} items - Array of product items
 * @param {String} containerId - ID of the container
 */
function renderProductList(items, containerId = 'productList') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="search-no-results">No products found.</div>';
    return;
  }

  const listHTML = items.map(item => createProductListItemHTML(item)).join('');
  container.innerHTML = listHTML;
  initFavoriteButtons();
}

/**
 * Create product list item HTML
 * @param {Object} item - Product item object
 * @returns {String} HTML string for list item
 */
function createProductListItemHTML(item) {
  return `
    <div class="product-list-item" data-id="${item.id}">
      <div class="list-item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="list-item-info">
        <h3>${item.name}</h3>
        <p class="list-item-category">${item.category}</p>
        <p class="list-item-description">${item.description}</p>
        <div class="list-item-rating">
          ${createStarsHTML(item.rating)}
          <span>(${item.reviews} reviews)</span>
        </div>
      </div>
      <div class="list-item-price">
        <p class="price">$${item.price.toFixed(2)}</p>
        <button class="btn btn-primary" onclick="addProductToCart(this)">Add to Cart</button>
        <button class="btn btn-secondary" onclick="buyProduct(this)">Buy</button>
      </div>
    </div>
  `;
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

/**
 * Render filtered and sorted products
 * @param {String} category - Category to filter
 * @param {Object} filters - Filter options {minPrice, maxPrice, sortBy}
 * @param {String} containerId - ID of the container
 */
function renderFilteredProducts(category, filters = {}, containerId = 'filteredProducts') {
  let items = getShopItems(category);

  // Apply price filter
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    items = filterShopItemsByPrice(category, filters.minPrice, filters.maxPrice);
  }

  // Apply sorting
  if (filters.sortBy) {
    items = sortShopItems(items, filters.sortBy);
  }

  renderProductGrid(items, containerId);
}

/**
 * Render search results
 * @param {String} query - Search query
 * @param {String} containerId - ID of the container
 */
function renderSearchResults(query, containerId = 'searchResults') {
  const results = searchShopItems(query);
  const container = document.getElementById(containerId);

  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = '<div class="search-no-results">No products found for "' + query + '"</div>';
    return;
  }

  const resultsHTML = `
    <section class="section reveal">
      <h2 class="section-title">Search Results for "${query}"</h2>
      <p class="results-count">Found ${results.length} product(s)</p>
      <div class="product-grid" id="searchGrid">
        ${results.map(item => createProductCardHTML(item)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = resultsHTML;
  initFavoriteButtons();
}

/**
 * Render product details modal content
 * @param {String} productId - ID of the product
 */
function renderProductDetails(productId) {
  const item = getShopItemById(productId);
  if (!item) return;

  document.getElementById('detailProductImage').src = item.image;
  document.getElementById('detailProductName').textContent = item.name;
  document.getElementById('detailProductPrice').textContent = '$' + item.price.toFixed(2);
  document.getElementById('detailDescription').textContent = item.description;

  // Update rating display
  const ratingContainer = document.getElementById('detailRating');
  if (ratingContainer) {
    ratingContainer.innerHTML = createStarsHTML(item.rating);
  }

  const reviewCount = document.getElementById('detailReviewCount');
  if (reviewCount) {
    reviewCount.textContent = `(${item.reviews} reviews)`;
  }
}

/**
 * Render product comparison
 * @param {Array} productIds - Array of product IDs to compare
 * @param {String} containerId - ID of the container
 */
function renderProductComparison(productIds, containerId = 'comparisonTable') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const products = productIds.map(id => getShopItemById(id)).filter(p => p !== null);

  if (products.length === 0) {
    container.innerHTML = '<p>No products to compare.</p>';
    return;
  }

  const comparisonHTML = `
    <div class="comparison-table">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            ${products.map(p => `<th>${p.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            ${products.map(p => `<td>$${p.price.toFixed(2)}</td>`).join('')}
          </tr>
          <tr>
            <td>Rating</td>
            ${products.map(p => `<td>${p.rating} ⭐</td>`).join('')}
          </tr>
          <tr>
            <td>Reviews</td>
            ${products.map(p => `<td>${p.reviews}</td>`).join('')}
          </tr>
          <tr>
            <td>Category</td>
            ${products.map(p => `<td>${p.category}</td>`).join('')}
          </tr>
          <tr>
            <td>Action</td>
            ${products.map(p => `<td><button class="btn btn-primary" onclick="addProductToCart({dataset: {id: '${p.id}', name: '${p.name}', price: '${p.price}', image: '${p.image}'}})">Add to Cart</button></td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = comparisonHTML;
}

/**
 * Render quick view modal for a product
 * @param {String} productId - ID of the product
 * @param {String} modalId - ID of the modal container
 */
function renderQuickView(productId, modalId = 'quickViewModal') {
  const item = getShopItemById(productId);
  if (!item) return;

  const modal = document.getElementById(modalId);
  if (!modal) return;

  const quickViewHTML = `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="quick-view-info">
        <h3>${item.name}</h3>
        <p class="quick-view-price">$${item.price.toFixed(2)}</p>
        <div class="quick-view-rating">
          ${createStarsHTML(item.rating)}
          <span>(${item.reviews} reviews)</span>
        </div>
        <p class="quick-view-description">${item.description}</p>
        <p class="quick-view-category">Category: ${item.category}</p>
        <div class="quick-view-actions">
          <button class="btn btn-primary" onclick="addProductToCart({dataset: {id: '${item.id}', name: '${item.name}', price: '${item.price}', image: '${item.image}'}})">Add to Cart</button>
          <button class="btn btn-secondary" onclick="openProductDetail({dataset: {id: '${item.id}', name: '${item.name}', price: '${item.price}', image: '${item.image}', description: '${item.description}'}})">View Details</button>
        </div>
      </div>
    </div>
  `;

  modal.innerHTML = quickViewHTML;
}

/**
 * Render related products
 * @param {String} productId - ID of the current product
 * @param {String} containerId - ID of the container
 * @param {Number} limit - Number of related products to show
 */
function renderRelatedProducts(productId, containerId = 'relatedProducts', limit = 4) {
  const currentItem = getShopItemById(productId);
  if (!currentItem) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  // Find products in the same category
  let relatedItems = [];
  for (const category in shopItems) {
    relatedItems = shopItems[category].filter(
      item => item.category === currentItem.category && item.id !== productId
    );
    if (relatedItems.length > 0) break;
  }

  // If not enough items in same category, get from same price range
  if (relatedItems.length < limit) {
    for (const category in shopItems) {
      const priceRangeItems = shopItems[category].filter(
        item =>
          Math.abs(item.price - currentItem.price) < 50 &&
          item.id !== productId &&
          !relatedItems.find(r => r.id === item.id)
      );
      relatedItems = [...relatedItems, ...priceRangeItems];
    }
  }

  relatedItems = relatedItems.slice(0, limit);

  const relatedHTML = `
    <section class="section reveal">
      <h2 class="section-title">Related Products</h2>
      <div class="product-grid">
        ${relatedItems.map(item => createProductCardHTML(item)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = relatedHTML;
  initFavoriteButtons();
}

/**
 * Initialize the shop with default products
 * @param {String} category - Category to initialize (men, women, accessories)
 * @param {String} containerId - ID of the container
 */
function initializeShop(category = 'men', containerId = 'productGrid') {
  renderCategoryProducts(category, containerId);
}

export {
  renderProductGrid,
  createProductCardHTML,
  createStarsHTML,
  renderFeaturedProducts,
  renderProductList,
  createProductListItemHTML,
  renderCategoryProducts,
  renderFilteredProducts,
  renderSearchResults,
  renderProductDetails,
  renderProductComparison,
  renderQuickView,
  renderRelatedProducts,
  initializeShop
};
