const API_BASE = 'http://localhost:5000/api';

async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
}

function renderOrders(orders) {
  const spinner = document.getElementById('adminOrderSpinner');
  const emptyEl = document.getElementById('emptyOrders');
  const tableContainer = document.getElementById('ordersTableContainer');
  const tbody = document.getElementById('ordersTableBody');
  const countEl = document.getElementById('orderCount');

  if (spinner) spinner.style.display = 'none';

  if (orders.length === 0) {
    emptyEl.style.display = 'block';
    tableContainer.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  tableContainer.style.display = 'block';

  if (countEl) countEl.textContent = `Total: ${orders.length} order(s)`;

  tbody.innerHTML = '';

  // Show newest first
  const reversed = [...orders].reverse();

  reversed.forEach(order => {
    const statusColor = order.status === 'delivered' ? 'bg-success'
      : order.status === 'shipped' ? 'bg-primary'
      : order.status === 'cancelled' ? 'bg-danger'
      : 'bg-warning text-dark';

    // Build products list
    const productsList = order.products && order.products.length > 0
      ? order.products.map(p =>
          `<div class="small">${p.name || 'Product'} x${p.quantity}</div>`
        ).join('')
      : '<span class="text-muted small">No products</span>';

    const date = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : 'N/A';

    const shortId = order._id.toString().slice(-6).toUpperCase();

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="small text-muted">#${shortId}</td>
      <td class="fw-bold">${order.user || 'Guest'}</td>
      <td>${productsList}</td>
      <td class="text-danger fw-bold">₱${order.totalPrice.toLocaleString()}</td>
      <td class="small">${order.deliveryAddress || 'N/A'}</td>
      <td class="small">${date}</td>
      <td><span class="badge ${statusColor}">${order.status || 'pending'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = async function () {
  const orders = await fetchOrders();
  renderOrders(orders);
};
