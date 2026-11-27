const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://shoe-pify-sqdg.onrender.com/api';

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

async function fetchPayments() {
  try {
    const res = await fetch(`${API_BASE}/payments`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

function renderOrders(orders, payments) {
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
  const reversed = [...orders].reverse();

  reversed.forEach(order => {
    const orderId = order._id.toString();

    // Match payment
    const payment = payments.find(p => {
      const pOrderId = typeof p.order === 'object'
        ? p.order?._id?.toString()
        : p.order?.toString();
      return pOrderId === orderId;
    });

    // Payment badge
    let paymentBadge = '<span class="badge bg-secondary">No payment info</span>';
    if (payment) {
      const isCompleted = payment.status === 'completed';
      const method = payment.method || 'Unknown';
      paymentBadge = isCompleted
        ? `<span class="badge bg-success">✅ ${method} - Paid</span>`
        : `<span class="badge bg-warning text-dark">💵 ${method} - Pending</span>`;
    } else if (order.paymentMethod) {
      const isCOD = order.paymentMethod === 'Cash on Delivery';
      paymentBadge = isCOD
        ? `<span class="badge bg-warning text-dark">💵 COD - Pending</span>`
        : `<span class="badge bg-success">✅ ${order.paymentMethod} - Paid</span>`;
    }

    // Order status badge
    const statusColor = order.status === 'paid' ? 'bg-success'
      : order.status === 'shipped' ? 'bg-primary'
      : order.status === 'delivered' ? 'bg-info'
      : order.status === 'cancelled' ? 'bg-danger'
      : 'bg-warning text-dark';

    // Products list WITH size
    const productsList = order.products && order.products.length > 0
      ? order.products.map(p => {
          const name = p.product?.name || p.name || 'Product';
          const size = p.size ? `<span class="badge bg-secondary ms-1">${p.size}</span>` : '';
          return `<div class="small">${name} x${p.quantity} ${size}</div>`;
        }).join('')
      : '<span class="text-muted small">No products</span>';

    const date = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : 'N/A';

    const shortId = orderId.slice(-6).toUpperCase();

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="small text-muted">#${shortId}</td>
      <td class="fw-bold">${order.user || 'Guest'}</td>
      <td>${productsList}</td>
      <td class="text-danger fw-bold">₱${order.totalPrice.toLocaleString()}</td>
      <td class="small">${order.deliveryAddress || 'N/A'}</td>
      <td class="small">${date}</td>
      <td><span class="badge ${statusColor}">${order.status || 'pending'}</span></td>
      <td>${paymentBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = async function () {
  const [orders, payments] = await Promise.all([fetchOrders(), fetchPayments()]);
  renderOrders(orders, payments);
};
