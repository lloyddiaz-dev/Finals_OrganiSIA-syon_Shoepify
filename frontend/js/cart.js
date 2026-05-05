const API_BASE = 'http://localhost:5000/api';

async function updateStock(productId, change) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`);
    const product = await res.json();
    const newStock = product.stock + change;
    if (newStock < 0) return false;
    await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock })
    });
    return true;
  } catch (err) {
    console.error('Stock update failed:', err);
    return false;
  }
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
  const tbody = document.getElementById('cartTableBody');
  const totalEl = document.getElementById('cartTotal');
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');

  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartContent.style.display = 'block';
  tbody.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" alt="${item.name}"
            style="width:55px; height:55px; object-fit:cover; border-radius:6px;"
            onerror="this.src='img/NikeAirMax.jpeg'">
          <span class="fw-bold">${item.name}</span>
        </div>
      </td>
      <td>₱${item.price.toLocaleString()}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary decrease-btn" data-index="${index}" data-id="${item.id}">−</button>
          <span class="fw-bold">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary increase-btn" data-index="${index}" data-id="${item.id}">+</button>
        </div>
      </td>
      <td class="text-danger fw-bold">₱${subtotal.toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-danger remove-btn" data-index="${index}" data-id="${item.id}" data-qty="${item.qty}">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = `₱${total.toLocaleString()}`;
  setupCartButtons();
}

function setupCartButtons() {

  // INCREASE QTY
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const i = Number(btn.getAttribute('data-index'));
      const id = btn.getAttribute('data-id');
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');

      const res = await fetch(`${API_BASE}/products/${id}`);
      const product = await res.json();
      if (product.stock <= 0) {
        alert('No more stock available!');
        return;
      }

      cart[i].qty += 1;
      localStorage.setItem('shoepify_cart', JSON.stringify(cart));
      await updateStock(id, -1);
      renderCart();
    });
  });

  // DECREASE QTY
  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const i = Number(btn.getAttribute('data-index'));
      const id = btn.getAttribute('data-id');
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');

      if (cart[i].qty > 1) {
        cart[i].qty -= 1;
        localStorage.setItem('shoepify_cart', JSON.stringify(cart));
        await updateStock(id, +1);
      } else {
        await updateStock(id, +1);
        cart.splice(i, 1);
        localStorage.setItem('shoepify_cart', JSON.stringify(cart));
      }
      renderCart();
    });
  });

  // REMOVE
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const i = Number(btn.getAttribute('data-index'));
      const id = btn.getAttribute('data-id');
      const qty = Number(btn.getAttribute('data-qty'));
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');

      await updateStock(id, +qty);
      cart.splice(i, 1);
      localStorage.setItem('shoepify_cart', JSON.stringify(cart));
      renderCart();
    });
  });
}

function setupCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
    if (cart.length === 0) return;

    // Fill order summary in modal
    const summaryEl = document.getElementById('orderSummary');
    const modalTotal = document.getElementById('modalTotal');
    let total = 0;

    summaryEl.innerHTML = cart.map(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="d-flex justify-content-between mb-1 small">
          <span>${item.name} x${item.qty}</span>
          <span class="text-danger fw-bold">₱${subtotal.toLocaleString()}</span>
        </div>
      `;
    }).join('');

    modalTotal.textContent = `₱${total.toLocaleString()}`;

    // Open modal
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
  });

  // PLACE ORDER BUTTON (inside modal)
  document.getElementById('confirmOrderBtn').addEventListener('click', async () => {
    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name || !address) {
      alert('Please fill in your name and delivery address!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Build order object matching backend schema
    const order = {
      user: name,
      products: cart.map(item => ({
        product: item.id,
        quantity: item.qty,
        name: item.name,
        price: item.price,
        image: item.image
      })),
      totalPrice: total,
      deliveryAddress: address,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!res.ok) throw new Error('Order failed');

      // Save to localStorage too for customer orders page
      let orders = JSON.parse(localStorage.getItem('shoepify_orders') || '[]');
      const savedOrder = await res.json();
      orders.push({
        id: savedOrder._id,
        date: order.date,
        items: cart,
        total: total,
        status: 'Pending',
        user: name,
        address: address
      });
      localStorage.setItem('shoepify_orders', JSON.stringify(orders));

      // Clear cart
      localStorage.setItem('shoepify_cart', '[]');

      alert(`Order placed successfully! Thank you, ${name}! 🎉`);
      window.location.href = 'orders.html';

    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error(error);
    }
  });
}

window.onload = function () {
  renderCart();
  setupCheckout();
};