<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1
let selectedRating = 0;

// Get logged in user
const currentUser = JSON.parse(localStorage.getItem('shoepify_user') || 'null');

function renderOrders() {
  const allOrders = JSON.parse(localStorage.getItem('shoepify_orders') || '[]');

  // ✅ Only show orders for the currently logged in user
  const orders = allOrders.filter(order => order.user === currentUser?.name);

  const ordersList = document.getElementById('ordersList');
  const emptyOrders = document.getElementById('emptyOrders');

  if (orders.length === 0) {
    emptyOrders.style.display = 'block';
    if (ordersList) ordersList.style.display = 'none';
    return;
  }

  emptyOrders.style.display = 'none';
  ordersList.innerHTML = '';

  const reversed = [...orders].reverse();

  reversed.forEach(order => {
    const isCOD = order.paymentMethod === 'Cash on Delivery';
    const paymentBadge = isCOD
      ? `<span class="badge bg-warning text-dark">💵 COD - Pending</span>`
      : `<span class="badge bg-success">✅ ${order.paymentMethod} - Paid</span>`;

    const statusColor = order.status === 'paid' ? 'bg-success'
      : order.status === 'delivered' ? 'bg-primary'
      : 'bg-warning text-dark';

    const itemsHTML = order.items.map(item => `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" alt="${item.name}"
            style="width:45px; height:45px; object-fit:cover; border-radius:6px;"
            onerror="this.src='img/NikeAirMax.jpeg'">
          <div>
            <p class="mb-0 fw-bold small">${item.name}</p>
            <p class="mb-0 text-muted small">
              Qty: ${item.qty} &bull;
              Size: <span class="badge bg-secondary">${item.size || 'N/A'}</span> &bull;
              ₱${(item.price * item.qty).toLocaleString()}
            </p>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger review-btn"
          data-product-id="${item.id}"
          data-product-name="${item.name}"
          data-user="${order.user}">
          ⭐ Review
        </button>
      </div>
    `).join('');

    const card = document.createElement('div');
    card.className = 'card p-3 mb-3 shadow-sm';
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p class="mb-0 text-muted small">Order #${order.id.toString().slice(-6).toUpperCase()}</p>
          <p class="mb-0 text-muted small">Date: ${order.date}</p>
          <p class="mb-0 text-muted small">📍 ${order.address || 'N/A'}</p>
        </div>
        <div class="text-end d-flex flex-column gap-1">
          <span class="badge ${statusColor}">${order.status}</span>
          ${paymentBadge}
        </div>
      </div>
      <hr class="my-2">
      ${itemsHTML}
      <hr class="my-2">
      <div class="text-end">
        <span class="fw-bold">Total: </span>
        <span class="text-danger fw-bold">₱${order.total.toLocaleString()}</span>
      </div>
    `;

    ordersList.appendChild(card);
  });

  setupReviewButtons();
}

function setupReviewButtons() {
  document.querySelectorAll('.review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      const productName = btn.getAttribute('data-product-name');
      const userName = btn.getAttribute('data-user');

      document.getElementById('reviewProductId').value = productId;
      document.getElementById('reviewProductName').textContent = productName;
      document.getElementById('reviewUserName').value = userName;
      document.getElementById('reviewComment').value = '';
      document.getElementById('selectedRating').value = '0';
      selectedRating = 0;
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));

      new bootstrap.Modal(document.getElementById('reviewModal')).show();
    });
  });
}

function setupStarRating() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = Number(star.getAttribute('data-value'));
      document.getElementById('selectedRating').value = selectedRating;
      stars.forEach(s => {
        s.classList.toggle('active', Number(s.getAttribute('data-value')) <= selectedRating);
      });
    });

    star.addEventListener('mouseover', () => {
      const val = Number(star.getAttribute('data-value'));
      stars.forEach(s => {
        s.classList.toggle('active', Number(s.getAttribute('data-value')) <= val);
      });
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => {
        s.classList.toggle('active', Number(s.getAttribute('data-value')) <= selectedRating);
      });
    });
  });
}

function setupReviewSubmit() {
  document.getElementById('submitReviewBtn').addEventListener('click', async () => {
    const productId = document.getElementById('reviewProductId').value;
    const userName = document.getElementById('reviewUserName').value;
    const rating = Number(document.getElementById('selectedRating').value);
    const comment = document.getElementById('reviewComment').value.trim();

    if (rating === 0) { alert('Please select a star rating!'); return; }
    if (!comment) { alert('Please write a comment!'); return; }

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userName, product: productId, rating, comment })
      });

      if (!res.ok) throw new Error('Review failed');
      alert('Review submitted! Thank you! ⭐');
      bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
    } catch (error) {
      alert('Failed to submit review.');
      console.error(error);
    }
  });
}

window.onload = function () {
  // Redirect to login if not logged in
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  renderOrders();
  setupStarRating();
  setupReviewSubmit();
};
