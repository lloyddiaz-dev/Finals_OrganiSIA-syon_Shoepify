function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('shoepify_orders') || '[]');
  const ordersList = document.getElementById('ordersList');
  const emptyOrders = document.getElementById('emptyOrders');

  if (orders.length === 0) {
    emptyOrders.style.display = 'block';
    ordersList.style.display = 'none';
    return;
  }

  emptyOrders.style.display = 'none';
  ordersList.innerHTML = '';

  // Show newest orders first
  const reversed = [...orders].reverse();

  reversed.forEach(order => {
    const statusColor = order.status === 'Delivered' ? 'bg-success'
      : order.status === 'Cancelled' ? 'bg-danger'
      : 'bg-warning text-dark';

    const itemsHTML = order.items.map(item => `
      <div class="d-flex align-items-center gap-2 mb-2">
        <img src="${item.image}" alt="${item.name}"
          style="width:45px; height:45px; object-fit:cover; border-radius:6px;"
          onerror="this.src='img/NikeAirMax.jpeg'">
        <div>
          <p class="mb-0 fw-bold small">${item.name}</p>
          <p class="mb-0 text-muted small">Qty: ${item.qty} &bull; ₱${(item.price * item.qty).toLocaleString()}</p>
        </div>
      </div>
    `).join('');

    const card = document.createElement('div');
    card.className = 'card p-3 mb-3 shadow-sm';
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <p class="mb-0 text-muted small">Order #${order.id}</p>
          <p class="mb-0 text-muted small">Date: ${order.date}</p>
        </div>
        <span class="badge ${statusColor}">${order.status}</span>
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
}

window.onload = function () {
  renderOrders();
};
