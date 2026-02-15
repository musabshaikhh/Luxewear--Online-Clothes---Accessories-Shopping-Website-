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
  else cart.push({ ...item, qty: item.qty || 1 });
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

// Init cart count on load
updateCartCount();
