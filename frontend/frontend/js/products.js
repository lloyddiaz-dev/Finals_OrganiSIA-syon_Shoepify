const API_BASE = 'http://localhost:5000/api';

let allProducts = []; // Store globally so search can filter without re-fetching

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    showError('Failed to load products. Make sure the backend server is running.');
    console.error('Fetch error:', error);
    return [];
  }
}

function renderProducts(products) {
  const container = document.getElementById('productList');
  const countEl = document.getElementById('productCount');
  const spinner = document.getElementById('loadingSpinner');

  // Hide spinner once data is ready
  if (spinner) spinner.style.display = 'none';

  container.innerHTML = ''; // Clear before re-rendering

  // Update count label
  if (countEl) {
    countEl.textContent = `Showing ${products.length} product(s)`;
  }

  // Show message if no results
  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No products found.</p>
      </div>`;
    return;
  }

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';

    // Handle optional fields safely
    const brand = product.brand || 'Unknown Brand';
    const color = product.color || 'N/A';
    const image = product.imageUrl || 'img/NikeAirMax.jpeg';
    const category = product.category?.name || 'Uncategorized';
    const sizes = product.size?.length > 0
      ? product.size.join(', ')
      : 'No sizes listed';
    const stockBadge = product.stock > 0
      ? `<span class="badge bg-success">In Stock (${product.stock})</span>`
      : `<span class="badge bg-danger">Out of Stock</span>`;

    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card">
        <img 
          src="${image}" 
          class="card-img-top" 
          alt="${product.name}"
          style="height: 200px; object-fit: cover;"
          onerror="this.src='img/NikeAirMax.jpeg'"
        >
        <div class="card-body d-flex flex-column">
          <h6 class="card-title fw-bold">${product.name}</h6>
          <p class="text-muted small mb-1">${brand} &bull; ${color}</p>
          <p class="text-muted small mb-1">Category: ${category}</p>
          <p class="card-text small">${product.description || ''}</p>
          <p class="small mb-1"><strong>Sizes:</strong> ${sizes}</p>
          <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-danger fs-5">₱${product.price.toLocaleString()}</span>
            ${stockBadge}
          </div>
          <button class="btn btn-danger w-100 mt-2">Add to Cart</button>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-warning w-50 edit-btn" data-id="${product._id}">✏️ Edit</button>
            <button class="btn btn-danger w-50 delete-btn" data-id="${product._id}">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  // Attach edit and delete events after cards are rendered
  setupEditAndDelete();
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      (p.brand && p.brand.toLowerCase().includes(keyword))
    );
    renderProducts(filtered);
  });
}

function setupEditAndDelete() {

  // EDIT BUTTON — open modal and prefill fields
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');

      // Find product from allProducts (no extra fetch needed)
      const product = allProducts.find(p => p._id === id);
      if (!product) return;

      // Prefill modal fields
      document.getElementById('editId').value = product._id;
      document.getElementById('editName').value = product.name;
      document.getElementById('editPrice').value = product.price;
      document.getElementById('editBrand').value = product.brand || '';
      document.getElementById('editDescription').value = product.description || '';
      document.getElementById('editStock').value = product.stock;

      // Open the modal
      new bootstrap.Modal(document.getElementById('editModal')).show();
    });
  });

  // SAVE EDIT BUTTON — send PUT request to backend
  const saveBtn = document.getElementById('saveEditBtn');
  if (saveBtn) {
    // Remove old listener to prevent duplicates
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    document.getElementById('saveEditBtn').addEventListener('click', async () => {
      const id = document.getElementById('editId').value;
      const updatedData = {
        name: document.getElementById('editName').value,
        price: Number(document.getElementById('editPrice').value),
        brand: document.getElementById('editBrand').value,
        description: document.getElementById('editDescription').value,
        stock: Number(document.getElementById('editStock').value)
      };

      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error('Update failed');
        alert('✅ Product updated successfully!');
        location.reload();
      } catch (error) {
        alert('❌ Failed to update product. Make sure the backend PUT route exists.');
        console.error(error);
      }
    });
  }

  // DELETE BUTTON — send DELETE request to backend
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this product?')) return;

      const id = btn.getAttribute('data-id');
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Delete failed');
        alert('🗑️ Product deleted successfully!');
        location.reload();
      } catch (error) {
        alert('❌ Failed to delete product. Make sure the backend DELETE route exists.');
        console.error(error);
      }
    });
  });
}

function showError(message) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';

  const container = document.getElementById('productList');
  if (container) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">${message}</div>
      </div>`;
  }
}

window.onload = async function () {
  allProducts = await fetchProducts();
  renderProducts(allProducts);
  setupSearch();
};