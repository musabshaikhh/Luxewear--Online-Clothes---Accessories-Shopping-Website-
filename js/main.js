// ================= MAIN ENTRY POINT =================

// Expose all functions to window scope for inline onclick handlers
window.toggleMenu = toggleMenu;
window.toggleSearch = toggleSearch;
window.syncSearchInputs = syncSearchInputs;
window.clearSearchMobile = clearSearchMobile;
window.handleSearch = handleSearch;
window.toggleCart = toggleCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.cartUpdateQty = cartUpdateQty;
window.removeFromCart = removeFromCart;
window.addProductToCart = addProductToCart;
window.buyProduct = buyProduct;
window.toggleFavorites = toggleFavorites;
window.openFavorites = openFavorites;
window.closeFavorites = closeFavorites;
window.removeFromFavorites = removeFromFavorites;
window.addProductToFavorites = addProductToFavorites;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.openSettings = openSettings;
window.handleSettings = handleSettings;
window.signInWithGoogle = signInWithGoogle;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.handleDemoPayment = handleDemoPayment;
window.openProductDetail = openProductDetail;
window.closeProductDetail = closeProductDetail;
window.increaseDetailQty = increaseDetailQty;
window.decreaseDetailQty = decreaseDetailQty;
window.addDetailProductToCart = addDetailProductToCart;
window.buyDetailProduct = buyDetailProduct;
window.toggleDetailFavorite = toggleDetailFavorite;
window.setRating = setRating;
window.submitReview = submitReview;
window.deleteReview = deleteReview;

// Document-level event listeners for closing modals on overlay click
document.addEventListener('click', function(e) {
  const authOverlay = document.getElementById('authOverlay');
  const authModal = document.getElementById('authModal');
  if (authOverlay && authOverlay.classList.contains('open') &&
      e.target === authOverlay && !authModal?.contains(e.target)) {
    closeAuth();
  }
});

document.addEventListener('click', function(e) {
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutOverlay && checkoutOverlay.classList.contains('open') &&
      e.target === checkoutOverlay && !checkoutModal?.contains(e.target)) {
    closeCheckout();
  }
});

document.addEventListener('click', function(e) {
  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if (overlay && overlay.classList.contains('open') &&
      e.target === overlay && !modal?.contains(e.target)) {
    closeProductDetail();
  }
});

// Initialization on page load
updateCartCount();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFavoriteButtons);
} else {
  initFavoriteButtons();
}
