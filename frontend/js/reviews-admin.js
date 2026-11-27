const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://shoe-pify-sqdg.onrender.com/api';

async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    console.log('Reviews fetched:', data); // debug
    return data;
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return [];
  }
}

// Render stars
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return `<span class="star-display">${stars}</span> <span class="text-muted small">(${rating}/5)</span>`;
}

function renderReviews(reviews) {
  const spinner = document.getElementById('reviewSpinner');
  const emptyEl = document.getElementById('emptyReviews');
  const tableContainer = document.getElementById('reviewsTableContainer');
  const tbody = document.getElementById('reviewsTableBody');
  const countEl = document.getElementById('reviewCount');

  if (spinner) spinner.style.display = 'none';

  if (!reviews || reviews.length === 0) {
    emptyEl.style.display = 'block';
    tableContainer.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  tableContainer.style.display = 'block';
  if (countEl) countEl.textContent = `Total: ${reviews.length} review(s)`;

  tbody.innerHTML = '';
  const reversed = [...reviews].reverse();

  reversed.forEach(review => {
    const date = review.createdAt
      ? new Date(review.createdAt).toLocaleDateString()
      : 'N/A';

    // Get product name - could be object or string
    const productDisplay = review.product?.name || review.product || 'N/A';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold">${review.user || 'Anonymous'}</td>
      <td class="small text-muted">${productDisplay}</td>
      <td>${renderStars(review.rating)}</td>
      <td>${review.comment || 'No comment'}</td>
      <td class="small">${date}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = async function () {
  const reviews = await fetchReviews();
  renderReviews(reviews);
};
