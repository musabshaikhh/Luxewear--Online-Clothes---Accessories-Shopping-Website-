// SCROLL REVEAL
function revealOnScroll(){
  const reveals=document.querySelectorAll('.reveal');
  reveals.forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight - 100){
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll',revealOnScroll);
revealOnScroll();

// MOBILE MENU
function toggleMenu(){
  const nav=document.getElementById("navLinks");
  const menuIcon=document.getElementById("menuIcon");
  const closeIcon=document.getElementById("closeIcon");
  if(nav){  
    nav.classList.toggle("active");
    document.body.classList.toggle("menu-open", nav.classList.contains("active"));
  }
  if(menuIcon) menuIcon.style.display=nav&&nav.classList.contains("active")?"none":"block";
  if(closeIcon) closeIcon.style.display=nav&&nav.classList.contains("active")?"block":"none";
}
// Close mobile menu when a nav link is clicked
document.addEventListener("click", function(e){
  const nav=document.getElementById("navLinks");
  if(nav&&nav.classList.contains("active")&&e.target.closest(".nav-links a")) toggleMenu();
});

// ================= SEARCH =================
function toggleSearch(){
  var wrap=document.querySelector(".search-wrap");
  var input=document.getElementById("searchInput");
  var inputMobile=document.getElementById("searchInputMobile");
  if(!wrap) return;
  wrap.classList.toggle("open");
  if(wrap.classList.contains("open")){
    if(input){ input.value=""; input.focus(); }
    if(inputMobile) inputMobile.value="";
    handleSearch("");
  } else {
    if(input) input.value="";
    if(inputMobile) inputMobile.value="";
    handleSearch("");
  }
}
function syncSearchInputs(value){
  var input=document.getElementById("searchInput");
  if(input) input.value=value;
}
function clearSearchMobile(){
  var inputMobile=document.getElementById("searchInputMobile");
  if(inputMobile){ inputMobile.value=""; inputMobile.focus(); }
  handleSearch("");
}
function handleSearch(value){
  var term=(value||"").trim().toLowerCase();
  var cards=document.querySelectorAll(".category-card, .product-card");
  var noResults=document.getElementById("searchNoResults");
  var visible=0;
  cards.forEach(function(card){
    var h3=card.querySelector("h3");
    var p=card.querySelector(".category-info p, .product-info p");
    var name=card.dataset.name||"";
    var text=((h3&&h3.textContent)||"")+" "+((p&&p.textContent)||"")+" "+name;
    var show=!term||text.toLowerCase().indexOf(term)!==-1;
    card.style.display=show?"":"none";
    if(show) visible++;
  });
  if(noResults){
    if(term&&visible===0){ noResults.classList.add("visible"); noResults.textContent='No results found for "'+value.trim()+'".'; }
    else{ noResults.classList.remove("visible"); noResults.textContent="No results found."; }
  }
}
document.addEventListener("click", function(e){
  var wrap=document.querySelector(".search-wrap");
  if(wrap&&wrap.classList.contains("open")&&!wrap.contains(e.target)) toggleSearch();
});

// ================= CART SIDEBAR =================
const CART_KEY = 'luxewear_cart';

function getCart(){
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function saveCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function openCart(){
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if(overlay) overlay.classList.add('open');
  if(sidebar) sidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart(){
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if(overlay) overlay.classList.remove('open');
  if(sidebar) sidebar.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleCart(){
  const sidebar = document.getElementById('cartSidebar');
  if(sidebar && sidebar.classList.contains('open')) closeCart();
  else openCart();
}

function updateCartCount(){
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach(function(el){ el.textContent = total; });
}

function renderCart(){
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const subtotalEl = document.getElementById('cartSubtotal');
  if(!container) return;

  container.innerHTML = '';
  if(cart.length === 0){
    if(emptyEl) emptyEl.classList.add('show');
    if(footerEl) footerEl.classList.add('hidden');
    return;
  }
  if(emptyEl) emptyEl.classList.remove('show');
  if(footerEl) footerEl.classList.remove('hidden');

  let total = 0;
  cart.forEach((item, index) => {
    const price = item.price || 0;
    const qty = item.qty || 1;
    total += price * qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img class="cart-item-img" src="${item.image || ''}" alt="${item.name || 'Item'}">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name || 'Product'}</div>
        <div class="cart-item-price">$${price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button type="button" onclick="cartUpdateQty(${index}, -1)">−</button>
          <span>${qty}</span>
          <button type="button" onclick="cartUpdateQty(${index}, 1)">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove">
        <span class="material-symbols-outlined">delete</span>
      </button>
    `;
    container.appendChild(div);
  });
  if(subtotalEl) subtotalEl.textContent = '$' + total.toFixed(2);
}

function cartUpdateQty(index, delta){
  const cart = getCart();
  const item = cart[index];
  if(!item) return;
  item.qty = Math.max(1, (item.qty || 1) + delta);
  saveCart(cart);
  renderCart();
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function addToCart(item){
  const cart = getCart();
  const existing = cart.find(x => x.id === item.id);
  if(existing) existing.qty = (existing.qty || 1) + (item.qty || 1);
  else cart.push({ ...item, qty: item.qty || 1, selected: true });
  saveCart(cart);
  renderCart();
}

function getSelectedCart(){
  const cart = getCart();
  return cart.filter(item => item.selected !== false);
}

function cartToggleSelect(index){
  const cart = getCart();
  if(cart[index]) {
    cart[index].selected = !cart[index].selected;
    saveCart(cart);
    renderCart();
  }
}

function cartSelectAll(selectAll){
  const cart = getCart();
  cart.forEach(item => {
    item.selected = selectAll;
  });
  saveCart(cart);
  renderCart();
}

function addProductToCart(btn){
  const card = btn.closest('.product-card');
  if(!card) return;
  const item = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: parseFloat(card.dataset.price) || 0,
    image: card.dataset.image || ''
  };
  addToCart(item);
}

function buyProduct(btn){
  addProductToCart(btn);
  openCart();
}

function addProductToFavorites(btn){
  btn.stopPropagation ? btn.stopPropagation() : (event.cancelBubble = true);
  const card = btn.closest('.product-card');
  if(!card) return;
  
  const favorites = getFavorites();
  const productId = card.dataset.id;
  const productName = card.dataset.name;
  const productPrice = parseFloat(card.dataset.price) || 0;
  const productImage = card.dataset.image || '';
  
  const existingIndex = favorites.findIndex(f => f.id === productId);
  
  if(existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
    btn.classList.remove('is-favorited');
    showNotification('Removed', `${productName} removed from favorites`, 'info');
  } else {
    // Add to favorites
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

// Init cart count on load
updateCartCount();
// ================= FAVORITES SIDEBAR =================
const FAVORITES_KEY = 'luxewear_favorites';

function getFavorites(){
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
}

function saveFavorites(items){
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function openFavorites(){
  const overlay = document.getElementById('favoritesOverlay');
  const sidebar = document.getElementById('favoritesSidebar');
  if(overlay) overlay.classList.add('open');
  if(sidebar) sidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderFavorites();
}

function closeFavorites(){
  const overlay = document.getElementById('favoritesOverlay');
  const sidebar = document.getElementById('favoritesSidebar');
  if(overlay) overlay.classList.remove('open');
  if(sidebar) sidebar.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleFavorites(){
  const sidebar = document.getElementById('favoritesSidebar');
  if(sidebar && sidebar.classList.contains('open')) closeFavorites();
  else openFavorites();
}

function renderFavorites(){
  const favorites = getFavorites();
  const container = document.getElementById('favoritesItems');
  const emptyEl = document.getElementById('favoritesEmpty');
  if(!container) return;

  container.innerHTML = '';
  if(favorites.length === 0){
    if(emptyEl) emptyEl.classList.add('show');
    return;
  }
  if(emptyEl) emptyEl.classList.remove('show');

  favorites.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    div.innerHTML = `
      <img class="favorite-item-img" src="${item.image || ''}" alt="${item.name || 'Item'}">
      <div class="favorite-item-details">
        <div class="favorite-item-name">${item.name || 'Product'}</div>
        <div class="favorite-item-price">$${(item.price || 0).toFixed(2)}</div>
      </div>
      <button type="button" class="favorite-item-remove" onclick="removeFromFavorites(${index})" aria-label="Remove from favorites">
        <span class="material-symbols-outlined">delete</span>
      </button>
    `;
    container.appendChild(div);
  });
}

function removeFromFavorites(index){
  const favorites = getFavorites();
  favorites.splice(index, 1);
  saveFavorites(favorites);
  renderFavorites();
}

function addToFavorites(item){
  const favorites = getFavorites();
  const existing = favorites.find(x => x.id === item.id);
  if(!existing) {
    favorites.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    saveFavorites(favorites);
  }
}

function addProductToFavorites(btn){
  const card = btn.closest('.product-card');
  if(!card) return;
  const item = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: parseFloat(card.dataset.price) || 0,
    image: card.dataset.image || ''
  };
  addToFavorites(item);
  showNotification('Added', 'Item added to favorites', 'success');
}

// ================= AUTH MODAL =================
const USER_KEY = 'luxewear_user';

function getUser(){
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch(e) {
    return null;
  }
}

function saveUser(userData){
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

function clearUser(){
  localStorage.removeItem(USER_KEY);
}

function openAuth(){
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  if(overlay) overlay.classList.add('open');
  if(modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  const user = getUser();
  if(user) {
    switchAuthTab('profile');
    updateProfileDisplay();
  } else {
    switchAuthTab('login');
  }
}

function closeAuth(){
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  if(overlay) overlay.classList.remove('open');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tabName){
  const tabs = document.querySelectorAll('.auth-tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));
  const activeTab = document.getElementById(tabName + 'Tab');
  if(activeTab) activeTab.classList.remove('hidden');
}

function handleLogin(event){
  event.preventDefault();
  const email = document.getElementById('loginEmail')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';
  
  if(!email || !password) {
    showNotification('Error', 'Please fill all fields', 'error');
    return;
  }
  
  const userData = {
    name: email.split('@')[0],
    email: email,
    phone: '',
    notifications: true,
    loginDate: new Date().toISOString()
  };
  
  saveUser(userData);
  showNotification('Success', 'Login successful!', 'success');
  switchAuthTab('profile');
  updateProfileDisplay();
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

function handleSignup(event){
  event.preventDefault();
  const name = document.getElementById('signupName')?.value || '';
  const email = document.getElementById('signupEmail')?.value || '';
  const password = document.getElementById('signupPassword')?.value || '';
  const confirm = document.getElementById('signupConfirm')?.value || '';
  
  if(!name || !email || !password || !confirm) {
    showNotification('Error', 'Please fill all fields', 'error');
    return;
  }
  
  if(password !== confirm) {
    showNotification('Error', 'Passwords do not match', 'error');
    return;
  }
  
  const userData = {
    name: name,
    email: email,
    phone: '',
    notifications: true,
    joinDate: new Date().toISOString()
  };
  
  saveUser(userData);
  showNotification('Success', 'Account created successfully!', 'success');
  switchAuthTab('profile');
  updateProfileDisplay();
  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('signupConfirm').value = '';
}

function handleLogout(){
  if(confirm('Are you sure you want to logout?')) {
    clearUser();
    showNotification('Success', 'Logged out successfully!', 'success');
    closeAuth();
  }
}

function updateProfileDisplay(){
  const user = getUser();
  if(user) {
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    if(nameEl) nameEl.textContent = user.name || 'User';
    if(emailEl) emailEl.textContent = user.email || 'Not set';
    
    // Populate settings form
    document.getElementById('settingsName').value = user.name || '';
    document.getElementById('settingsEmail').value = user.email || '';
    document.getElementById('settingsPhone').value = user.phone || '';
    document.getElementById('settingsNotifications').checked = user.notifications !== false;
  }
}

function openSettings(){
  updateProfileDisplay();
  switchAuthTab('settings');
}

function handleSettings(event){
  event.preventDefault();
  const user = getUser();
  if(!user) {
    showNotification('Error', 'Not logged in', 'error');
    return;
  }
  
  user.name = document.getElementById('settingsName')?.value || user.name;
  user.email = document.getElementById('settingsEmail')?.value || user.email;
  user.phone = document.getElementById('settingsPhone')?.value || '';
  user.notifications = document.getElementById('settingsNotifications')?.checked !== false;
  
  saveUser(user);
  showNotification('Success', 'Settings saved successfully!', 'success');
  updateProfileDisplay();
  switchAuthTab('profile');
}

// Close auth modal when clicking overlay
document.addEventListener('click', function(e){
  const authOverlay = document.getElementById('authOverlay');
  const authModal = document.getElementById('authModal');
  if(authOverlay && authOverlay.classList.contains('open') && 
     e.target === authOverlay && !authModal?.contains(e.target)) {
    closeAuth();
  }
});

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "luxewear-demo.firebaseapp.com",
  projectId: "luxewear-demo",
  storageBucket: "luxewear-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg123456"
};

let firebaseInitialized = false;
try {
  if (!firebase) {
    console.warn('Firebase not loaded');
  } else {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
  }
} catch(e) {
  console.warn('Firebase initialization skipped:', e.message);
}

// ================= NOTIFICATION SYSTEM =================
function showNotification(title, message, type = 'info', duration = 5000){
  const container = document.getElementById('notificationContainer');
  if(!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon material-symbols-outlined">
      ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'}
    </span>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined">close</span>
    </button>
  `;
  
  container.appendChild(notification);
  
  if(duration > 0) {
    setTimeout(() => {
      notification.classList.add('removing');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// ================= GOOGLE LOGIN =================
function signInWithGoogle(){
  showNotification('Authenticating', 'Signing in with Google...', 'info', 2000);
  
  if(firebaseInitialized && firebase && firebase.auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = {
          name: result.user.displayName,
          email: result.user.email,
          phone: '',
          notifications: true,
          uid: result.user.uid,
          loginDate: new Date().toISOString()
        };
        saveUser(user);
        showNotification('Success', 'Logged in with Google!', 'success');
        switchAuthTab('profile');
        updateProfileDisplay();
        closeAuth();
      })
      .catch(error => {
        showNotification('Error', 'Google login failed: ' + error.message, 'error');
      });
  } else {
    // Demo mode - simulate Google login
    const demoUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      notifications: true,
      loginDate: new Date().toISOString()
    };
    saveUser(demoUser);
    showNotification('Success', 'Logged in successfully!', 'success');
    switchAuthTab('profile');
    updateProfileDisplay();
    closeAuth();
  }
}

// ================= CHECKOUT MODAL =================
function openCheckout(){
  const cart = getCart();
  if(cart.length === 0) {
    showNotification('Cart Empty', 'Add items to your cart before checking out', 'warning');
    return;
  }
  
  const user = getUser();
  if(!user) {
    showNotification('Login Required', 'Please login or signup before checkout', 'warning');
    closeCart();
    openAuth();
    return;
  }
  
  const overlay = document.getElementById('checkoutOverlay');
  const modal = document.getElementById('checkoutModal');
  if(overlay) overlay.classList.add('open');
  if(modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  renderCheckout();
  loadPayPalButton();
}

function closeCheckout(){
  const overlay = document.getElementById('checkoutOverlay');
  const modal = document.getElementById('checkoutModal');
  if(overlay) overlay.classList.remove('open');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckout(){
  const cart = getCart();
  const user = getUser();
  const container = document.getElementById('checkoutItems');
  if(!container) return;
  
  container.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const price = item.price || 0;
    const qty = item.qty || 1;
    const itemTotal = price * qty;
    subtotal += itemTotal;
    
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image || ''}" alt="${item.name || 'Item'}" class="checkout-item-img">
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name || 'Product'}</div>
        <div>$${price.toFixed(2)} x ${qty}</div>
      </div>
      <div>$${itemTotal.toFixed(2)}</div>
    `;
    container.appendChild(div);
  });
  
  const shipping = 10.00;
  const total = subtotal + shipping;
  
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const totalEl = document.getElementById('checkoutTotal');
  
  if(subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if(shippingEl) shippingEl.textContent = '$' + shipping.toFixed(2);
  if(totalEl) totalEl.textContent = '$' + total.toFixed(2);
  
  // Pre-fill user data
  if(user) {
    document.getElementById('shippingName').value = user.name || '';
    document.getElementById('shippingEmail').value = user.email || '';
    document.getElementById('shippingPhone').value = user.phone || '';
  }
}

function loadPayPalButton(){
  if(typeof paypal === 'undefined') return;
  
  const cart = getCart();
  let total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  total += 10; // shipping
  
  // Clear existing button
  const container = document.getElementById('paypal-button-container');
  if(container) container.innerHTML = '';
  
  try {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          handlePaymentSuccess(details);
        });
      },
      onError: (err) => {
        showNotification('Payment Error', 'An error occurred during payment', 'error');
      }
    }).render('#paypal-button-container');
  } catch(e) {
    // Fallback for demo
    const container = document.getElementById('paypal-button-container');
    if(container) {
      container.innerHTML = `
        <button class="primary-btn" style="width:100%; padding:12px;" onclick="handleDemoPayment()">
          Complete Order with PayPal (Demo)
        </button>
      `;
    }
  }
}

function handlePaymentSuccess(details){
  const user = getUser();
  const shippingName = document.getElementById('shippingName')?.value || '';
  const shippingEmail = document.getElementById('shippingEmail')?.value || '';
  const shippingPhone = document.getElementById('shippingPhone')?.value || '';
  const shippingAddress = document.getElementById('shippingAddress')?.value || '';
  const shippingCity = document.getElementById('shippingCity')?.value || '';
  const shippingState = document.getElementById('shippingState')?.value || '';
  const shippingZip = document.getElementById('shippingZip')?.value || '';
  const shippingCountry = document.getElementById('shippingCountry')?.value || '';
  
  if(!shippingName || !shippingEmail || !shippingAddress || !shippingCity) {
    showNotification('Missing Information', 'Please fill in all shipping details', 'error');
    return;
  }
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: shippingName,
    email: shippingEmail,
    phone: shippingPhone,
    shipping: {
      address: shippingAddress,
      city: shippingCity,
      state: shippingState,
      zip: shippingZip,
      country: shippingCountry
    },
    items: getCart(),
    total: details.purchase_units[0].amount.value,
    paymentStatus: 'completed',
    transactionId: details.id
  };
  
  // Save order
  let orders = JSON.parse(localStorage.getItem('luxewear_orders') || '[]');
  orders.push(order);
  localStorage.setItem('luxewear_orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.setItem('luxewear_cart', JSON.stringify([]));
  updateCartCount();
  renderCart();
  
  closeCheckout();
  showNotification('Order Confirmed', 'Your order has been placed successfully! Order ID: ' + order.id, 'success', 8000);
}

function handleDemoPayment(){
  const shippingName = document.getElementById('shippingName')?.value || '';
  const shippingEmail = document.getElementById('shippingEmail')?.value || '';
  const shippingPhone = document.getElementById('shippingPhone')?.value || '';
  const shippingAddress = document.getElementById('shippingAddress')?.value || '';
  const shippingCity = document.getElementById('shippingCity')?.value || '';
  const shippingState = document.getElementById('shippingState')?.value || '';
  const shippingZip = document.getElementById('shippingZip')?.value || '';
  const shippingCountry = document.getElementById('shippingCountry')?.value || '';
  
  if(!shippingName || !shippingEmail || !shippingAddress || !shippingCity) {
    showNotification('Missing Information', 'Please fill in all shipping details', 'error');
    return;
  }
  
  const cart = getCart();
  let subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  const total = (subtotal + 10).toFixed(2);
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: shippingName,
    email: shippingEmail,
    phone: shippingPhone,
    shipping: {
      address: shippingAddress,
      city: shippingCity,
      state: shippingState,
      zip: shippingZip,
      country: shippingCountry
    },
    items: cart,
    total: total,
    paymentStatus: 'completed',
    transactionId: 'DEMO-' + Date.now()
  };
  
  // Save order
  let orders = JSON.parse(localStorage.getItem('luxewear_orders') || '[]');
  orders.push(order);
  localStorage.setItem('luxewear_orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.setItem('luxewear_cart', JSON.stringify([]));
  updateCartCount();
  renderCart();
  
  closeCheckout();
  showNotification('Order Confirmed', 'Your order has been placed successfully! Order ID: ' + order.id, 'success', 8000);
}

// Close checkout modal when clicking overlay
document.addEventListener('click', function(e){
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  if(checkoutOverlay && checkoutOverlay.classList.contains('open') && 
     e.target === checkoutOverlay && !checkoutModal?.contains(e.target)) {
    closeCheckout();
  }
});

// ================= PRODUCT DETAIL MODAL =================
const REVIEWS_KEY = 'luxewear_reviews';
let currentDetailProductId = null;
let selectedRating = 0;

function getProductReviews(productId){
  try {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    return reviews[productId] || [];
  } catch(e) {
    return [];
  }
}

function saveReviews(productId, reviews){
  try {
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    allReviews[productId] = reviews;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
  } catch(e) {
    console.error('Error saving reviews:', e);
  }
}

function openProductDetail(element){
  const id = element.dataset.id;
  const name = element.dataset.name;
  const price = element.dataset.price;
  const image = element.dataset.image;
  const description = element.dataset.description || 'Premium quality product with excellent craftsmanship and materials.';
  
  currentDetailProductId = id;
  selectedRating = 0;
  
  // Update modal content
  document.getElementById('detailProductImage').src = image;
  document.getElementById('detailProductName').textContent = name;
  document.getElementById('detailProductPrice').textContent = '$' + price;
  document.getElementById('detailDescription').textContent = description;
  document.getElementById('detailSize').value = 'M';
  document.getElementById('detailQuantity').value = 1;
  
  // Reset form
  document.getElementById('reviewForm').reset();
  document.getElementById('selectedRating').value = 0;
  updateRatingStars(0);
  
  // Load reviews
  renderProductReviews(id);
  updateProductRatings(id);
  
  // Check if in favorites
  const favorites = getFavorites();
  const isFav = favorites.some(f => f.id === id);
  updateFavButton(isFav);
  
  // Open modal
  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if(overlay) overlay.classList.add('open');
  if(modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductDetail(){
  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if(overlay) overlay.classList.remove('open');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  currentDetailProductId = null;
}

function increaseDetailQty(){
  const qty = document.getElementById('detailQuantity');
  qty.value = parseInt(qty.value) + 1;
}

function decreaseDetailQty(){
  const qty = document.getElementById('detailQuantity');
  if(parseInt(qty.value) > 1) {
    qty.value = parseInt(qty.value) - 1;
  }
}

function addDetailProductToCart(){
  if(!currentDetailProductId) return;
  
  const detailName = document.getElementById('detailProductName').textContent;
  const detailPrice = parseFloat(document.getElementById('detailProductPrice').textContent.replace('$', ''));
  const detailImage = document.getElementById('detailProductImage').src;
  const qty = parseInt(document.getElementById('detailQuantity').value);
  
  const item = {
    id: currentDetailProductId,
    name: detailName,
    price: detailPrice,
    image: detailImage,
    qty: qty
  };
  
  addToCart(item);
  showNotification('Added to Cart', `${detailName} x${qty} added to your cart`, 'success');
  closeProductDetail();
}

function buyDetailProduct(){
  addDetailProductToCart();
  setTimeout(() => openCheckout(), 300);
}

function toggleDetailFavorite(){
  if(!currentDetailProductId) return;
  
  const detailName = document.getElementById('detailProductName').textContent;
  const detailPrice = parseFloat(document.getElementById('detailProductPrice').textContent.replace('$', ''));
  const detailImage = document.getElementById('detailProductImage').src;
  
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === currentDetailProductId);
  
  if(existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
    showNotification('Removed', `${detailName} removed from favorites`, 'info');
    updateFavButton(false);
  } else {
    // Add to favorites
    favorites.push({
      id: currentDetailProductId,
      name: detailName,
      price: detailPrice,
      image: detailImage
    });
    showNotification('Added', `${detailName} added to favorites`, 'success');
    updateFavButton(true);
  }
  
  saveFavorites(favorites);
}

function updateFavButton(isFavorite){
  const btn = document.getElementById('favBtn');
  if(!btn) return;
  
  if(isFavorite) {
    btn.classList.add('is-favorite');
    btn.innerHTML = '<span class="material-symbols-outlined">favorite</span> Remove from Favorites';
  } else {
    btn.classList.remove('is-favorite');
    btn.innerHTML = '<span class="material-symbols-outlined">favorite</span> Add to Favorites';
  }
}

function setRating(rating){
  selectedRating = rating;
  document.getElementById('selectedRating').value = rating;
  updateRatingStars(rating);
}

function updateRatingStars(rating){
  const btns = document.querySelectorAll('#ratingInput .star-btn');
  btns.forEach((btn, idx) => {
    if(idx < rating) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function submitReview(event){
  event.preventDefault();
  
  if(!currentDetailProductId) {
    showNotification('Error', 'Product not found', 'error');
    return;
  }
  
  if(selectedRating === 0) {
    showNotification('Error', 'Please select a rating', 'error');
    return;
  }
  
  const name = document.getElementById('reviewName').value.trim();
  const comment = document.getElementById('reviewComment').value.trim();
  
  if(!name || !comment) {
    showNotification('Error', 'Please fill in all fields', 'error');
    return;
  }
  
  const review = {
    id: 'review-' + Date.now(),
    name: name,
    rating: selectedRating,
    comment: comment,
    date: new Date().toISOString()
  };
  
  const reviews = getProductReviews(currentDetailProductId);
  reviews.push(review);
  saveReviews(currentDetailProductId, reviews);
  
  // Reset form
  document.getElementById('reviewForm').reset();
  selectedRating = 0;
  document.getElementById('selectedRating').value = 0;
  updateRatingStars(0);
  
  // Refresh reviews
  renderProductReviews(currentDetailProductId);
  updateProductRatings(currentDetailProductId);
  
  showNotification('Success', 'Review submitted successfully!', 'success');
}

function renderProductReviews(productId){
  const reviews = getProductReviews(productId);
  const container = document.getElementById('reviewsList');
  const noReviews = document.getElementById('noReviews');
  
  if(!container) return;
  
  container.innerHTML = '';
  
  if(reviews.length === 0) {
    noReviews.style.display = 'block';
    return;
  }
  
  noReviews.style.display = 'none';
  
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(review => {
    const div = document.createElement('div');
    div.className = 'review-item';
    
    const date = new Date(review.date);
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    let starsHtml = '';
    for(let i = 0; i < 5; i++) {
      starsHtml += i < review.rating ? '<span class="material-symbols-outlined">star</span>' : '<span class="material-symbols-outlined">star_outline</span>';
    }
    
    div.innerHTML = `
      <div class="review-header">
        <div>
          <span class="review-name">${review.name}</span>
          <span class="review-date">${dateStr}</span>
        </div>
        <button class="review-delete-btn" onclick="deleteReview('${productId}', '${review.id}')" title="Delete review" aria-label="Delete review">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
      <div class="review-stars">
        ${starsHtml}
      </div>
      <div class="review-text">${review.comment}</div>
    `;
    
    container.appendChild(div);
  });
}

function deleteReview(productId, reviewId){
  const reviews = getProductReviews(productId);
  const filteredReviews = reviews.filter(r => r.id !== reviewId);
  saveReviews(productId, filteredReviews);
  renderProductReviews(productId);
  updateProductRatings(productId);
  showNotification('Success', 'Review deleted successfully', 'success');
}

function updateProductRatings(productId){
  const reviews = getProductReviews(productId);
  
  if(reviews.length === 0) {
    document.getElementById('detailRating').innerHTML = `
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
    `;
    document.getElementById('detailReviewCount').textContent = '(0 reviews)';
    return;
  }
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedRating = Math.round(avgRating);
  
  let starsHtml = '';
  for(let i = 0; i < 5; i++) {
    starsHtml += i < roundedRating ? '<span class="material-symbols-outlined">star</span>' : '<span class="material-symbols-outlined">star_outline</span>';
  }
  
  document.getElementById('detailRating').innerHTML = starsHtml;
  document.getElementById('detailReviewCount').textContent = `(${reviews.length} reviews)`;
}

// Close product detail modal when clicking overlay
document.addEventListener('click', function(e){
  const overlay = document.getElementById('productDetailOverlay');
  const modal = document.getElementById('productDetailModal');
  if(overlay && overlay.classList.contains('open') && 
     e.target === overlay && !modal?.contains(e.target)) {
    closeProductDetail();
  }
});

// Initialize favorite button states on page load
function initFavoriteButtons(){
  const favorites = getFavorites();
  const favoriteIds = favorites.map(f => f.id);
  const favBtns = document.querySelectorAll('.product-favorite-btn');
  
  favBtns.forEach(btn => {
    const card = btn.closest('.product-card');
    if(card && favoriteIds.includes(card.dataset.id)) {
      btn.classList.add('is-favorited');
    }
  });
}

// Run on page load
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFavoriteButtons);
} else {
  initFavoriteButtons();
}

