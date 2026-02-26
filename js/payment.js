// ================= CHECKOUT MODAL =================
function openCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showNotification('Cart Empty', 'Add items to your cart before checking out', 'warning');
    return;
  }

  const user = getUser();
  if (!user) {
    showNotification('Login Required', 'Please login or signup before checkout', 'warning');
    closeCart();
    openAuth();
    return;
  }

  const overlay = document.getElementById('checkoutOverlay');
  const modal = document.getElementById('checkoutModal');
  if (overlay) overlay.classList.add('open');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  renderCheckout();
  loadPayPalButton();
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  const modal = document.getElementById('checkoutModal');
  if (overlay) overlay.classList.remove('open');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckout() {
  const cart = getCart();
  const user = getUser();
  const container = document.getElementById('checkoutItems');
  if (!container) return;

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

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = '$' + shipping.toFixed(2);
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);

  if (user) {
    document.getElementById('shippingName').value = user.name || '';
    document.getElementById('shippingEmail').value = user.email || '';
    document.getElementById('shippingPhone').value = user.phone || '';
  }
}

function loadPayPalButton() {
  if (typeof paypal === 'undefined') return;

  const cart = getCart();
  let total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  total += 10;

  const container = document.getElementById('paypal-button-container');
  if (container) container.innerHTML = '';

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
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = `
        <button class="primary-btn" style="width:100%; padding:12px;" onclick="handleDemoPayment()">
          Complete Order with PayPal (Demo)
        </button>
      `;
    }
  }
}

function handlePaymentSuccess(details) {
  const shippingName = document.getElementById('shippingName')?.value || '';
  const shippingEmail = document.getElementById('shippingEmail')?.value || '';
  const shippingPhone = document.getElementById('shippingPhone')?.value || '';
  const shippingAddress = document.getElementById('shippingAddress')?.value || '';
  const shippingCity = document.getElementById('shippingCity')?.value || '';
  const shippingState = document.getElementById('shippingState')?.value || '';
  const shippingZip = document.getElementById('shippingZip')?.value || '';
  const shippingCountry = document.getElementById('shippingCountry')?.value || '';

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity) {
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

  let orders = JSON.parse(localStorage.getItem('luxewear_orders') || '[]');
  orders.push(order);
  localStorage.setItem('luxewear_orders', JSON.stringify(orders));

  localStorage.setItem('luxewear_cart', JSON.stringify([]));
  updateCartCount();
  renderCart();

  closeCheckout();
  showNotification('Order Confirmed', 'Your order has been placed successfully! Order ID: ' + order.id, 'success', 8000);
}

function handleDemoPayment() {
  const shippingName = document.getElementById('shippingName')?.value || '';
  const shippingEmail = document.getElementById('shippingEmail')?.value || '';
  const shippingPhone = document.getElementById('shippingPhone')?.value || '';
  const shippingAddress = document.getElementById('shippingAddress')?.value || '';
  const shippingCity = document.getElementById('shippingCity')?.value || '';
  const shippingState = document.getElementById('shippingState')?.value || '';
  const shippingZip = document.getElementById('shippingZip')?.value || '';
  const shippingCountry = document.getElementById('shippingCountry')?.value || '';

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity) {
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

  let orders = JSON.parse(localStorage.getItem('luxewear_orders') || '[]');
  orders.push(order);
  localStorage.setItem('luxewear_orders', JSON.stringify(orders));

  localStorage.setItem('luxewear_cart', JSON.stringify([]));
  updateCartCount();
  renderCart();

  closeCheckout();
  showNotification('Order Confirmed', 'Your order has been placed successfully! Order ID: ' + order.id, 'success', 8000);
}
