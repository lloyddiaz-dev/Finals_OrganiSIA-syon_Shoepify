<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1

// Get logged in user
const currentUser = JSON.parse(localStorage.getItem('shoepify_user') || 'null');

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
      <td><span class="badge bg-secondary">${item.size || 'N/A'}</span></td>
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
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const i = Number(btn.getAttribute('data-index'));
      const id = btn.getAttribute('data-id');
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
      const res = await fetch(`${API_BASE}/products/${id}`);
      const product = await res.json();
      if (product.stock <= 0) { alert('No more stock available!'); return; }
      cart[i].qty += 1;
      localStorage.setItem('shoepify_cart', JSON.stringify(cart));
      await updateStock(id, -1);
      renderCart();
    });
  });

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

function setupPaymentHighlight() {
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.payment-option').classList.add('selected');
    });
  });
  const defaultOpt = document.querySelector('input[name="paymentMethod"]:checked');
  if (defaultOpt) defaultOpt.closest('.payment-option').classList.add('selected');
}

function setupCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
    if (cart.length === 0) return;

    // Fill saved user info in modal
    if (currentUser) {
      document.getElementById('displayName').textContent = `👤 ${currentUser.name}`;
      document.getElementById('displayAddress').textContent = `📍 ${currentUser.address || 'No address saved'}`;
    }

    const summaryEl = document.getElementById('orderSummary');
    const modalTotal = document.getElementById('modalTotal');
    let total = 0;

    summaryEl.innerHTML = cart.map(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="d-flex justify-content-between mb-1 small">
          <span>${item.name} (Size ${item.size || 'N/A'}) x${item.qty}</span>
          <span class="text-danger fw-bold">₱${subtotal.toLocaleString()}</span>
        </div>`;
    }).join('');

    modalTotal.textContent = `₱${total.toLocaleString()}`;
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
    setupPaymentHighlight();

    // Toggle different address fields
    document.getElementById('useDifferentAddress').addEventListener('change', function () {
      document.getElementById('differentAddressFields').style.display = this.checked ? 'block' : 'none';
    });
  });

  document.getElementById('confirmOrderBtn').addEventListener('click', async () => {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const useDifferent = document.getElementById('useDifferentAddress').checked;

    // Use saved user info or alternative
    let name, address;
    if (useDifferent) {
      name = document.getElementById('altName').value.trim();
      address = document.getElementById('altAddress').value.trim();
      if (!name || !address) {
        alert('Please fill in the alternative name and address!');
        return;
      }
    } else {
      name = currentUser?.name || '';
      address = currentUser?.address || '';
      if (!name || !address) {
        alert('No saved address found. Please use a different address.');
        document.getElementById('useDifferentAddress').checked = true;
        document.getElementById('differentAddressFields').style.display = 'block';
        return;
      }
    }

    const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const isCOD = paymentMethod === 'Cash on Delivery';
    const paymentStatus = isCOD ? 'pending' : 'completed';
    const orderStatus = isCOD ? 'pending' : 'paid';

    const order = {
      user: name,
      products: cart.map(item => ({
        product: item.id,
        quantity: item.qty,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size
      })),
      totalPrice: total,
      deliveryAddress: address,
      status: orderStatus,
      paymentMethod: paymentMethod,
      date: new Date().toLocaleDateString()
    };

    try {
      const orderRes = await fetch(`${API_BASE}/orders`, {
<<<<<<< HEAD
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order)
});

const responseData = await orderRes.json();

if (!orderRes.ok) {
  throw new Error(responseData.error || responseData.message || 'Order failed');
}

const savedOrder = responseData;
=======
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!orderRes.ok) throw new Error('Order failed');
      const savedOrder = await orderRes.json();
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1

      await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: savedOrder._id,
          amount: total,
          method: paymentMethod,
          status: paymentStatus,
          paidAt: isCOD ? null : new Date()
        })
      });

      let orders = JSON.parse(localStorage.getItem('shoepify_orders') || '[]');
      orders.push({
        id: savedOrder._id,
        date: order.date,
        items: cart,
        total,
        status: orderStatus,
        paymentMethod,
        paymentStatus,
        user: name,
        address
      });
      localStorage.setItem('shoepify_orders', JSON.stringify(orders));
      localStorage.setItem('shoepify_cart', '[]');

      const payMsg = isCOD ? 'Cash on Delivery — pay when it arrives!' : `${paymentMethod} — Payment confirmed! ✅`;
      alert(`Order placed! Thank you, ${name}! 🎉\n${payMsg}`);
      window.location.href = 'orders.html';

    } catch (error) {
<<<<<<< HEAD
  alert('Failed to place order: ' + error.message);
  console.error('Order Error:', error);
}
=======
      alert('Failed to place order. Please try again.');
      console.error(error);
    }
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1
  });
}

window.onload = function () {
  // Redirect to login if not logged in
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  renderCart();
  setupCheckout();
};
