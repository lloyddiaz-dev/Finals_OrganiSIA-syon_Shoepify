const API_BASE = 'http://localhost:5000/api';

let allProducts = [];

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (error) {
    alert('Failed to load products. Make sure the backend is running.');
    console.error(error);
    return [];
  }
}

function renderTable(products) {
  const tbody = document.getElementById('adminTableBody');
  const table = document.getElementById('adminTable');
  const spinner = document.getElementById('adminSpinner');
  const countEl = document.getElementById('adminProductCount');

  if (spinner) spinner.style.display = 'none';
  if (table) table.style.display = 'table';

  tbody.innerHTML = '';

  if (countEl) {
    countEl.textContent = `Showing ${products.length} product(s)`;
  }

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">No products found.</td>
      </tr>`;
    return;
  }

  products.forEach(product => {
    const image = product.imageUrl || 'img/NikeAirMax.jpeg';
    const brand = product.brand || 'N/A';
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <img src="${image}" alt="${product.name}"
          style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;"
          onerror="this.src='img/NikeAirMax.jpeg'">
      </td>
      <td class="fw-bold">${product.name}</td>
      <td>${brand}</td>
      <td class="text-danger fw-bold">₱${product.price.toLocaleString()}</td>
      <td>${product.stock}</td>
      <td class="small">${product.description || ''}</td>
      <td>
        <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${product._id}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">🗑️ Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach events after rendering
  setupEditButtons();
  setupDeleteButtons();
}

function setupSearch() {
  const searchInput = document.getElementById('adminSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      (p.brand && p.brand.toLowerCase().includes(keyword))
    );
    renderTable(filtered);
  });
}

function setupAddProduct() {
  const saveBtn = document.getElementById('saveAddBtn');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    const newProduct = {
      name: document.getElementById('addName').value,
      price: Number(document.getElementById('addPrice').value),
      brand: document.getElementById('addBrand').value,
      description: document.getElementById('addDescription').value,
      stock: Number(document.getElementById('addStock').value),
      imageUrl: document.getElementById('addImageUrl').value
    };

    // Basic validation
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in at least the product name and price.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!res.ok) throw new Error('Failed to add product');

      alert('Product added successfully!');

      // Clear form fields
      ['addName', 'addPrice', 'addBrand', 'addDescription', 'addStock', 'addImageUrl']
        .forEach(id => document.getElementById(id).value = '');

      // Close modal and refresh table
      bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
      allProducts = await fetchProducts();
      renderTable(allProducts);

    } catch (error) {
      alert('Failed to add product. Check your backend.');
      console.error(error);
    }
  });
}

function setupEditButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const product = allProducts.find(p => p._id === id);
      if (!product) return;

      // Prefill modal
      document.getElementById('editId').value = product._id;
      document.getElementById('editName').value = product.name;
      document.getElementById('editPrice').value = product.price;
      document.getElementById('editBrand').value = product.brand || '';
      document.getElementById('editDescription').value = product.description || '';
      document.getElementById('editStock').value = product.stock;
      document.getElementById('editImageUrl').value = product.imageUrl || '';

      new bootstrap.Modal(document.getElementById('editModal')).show();
    });
  });

  // Save edit
  const saveBtn = document.getElementById('saveEditBtn');
  if (saveBtn) {
    const newBtn = saveBtn.cloneNode(true);
    saveBtn.replaceWith(newBtn);

    newBtn.addEventListener('click', async () => {
      const id = document.getElementById('editId').value;
      const updatedData = {
        name: document.getElementById('editName').value,
        price: Number(document.getElementById('editPrice').value),
        brand: document.getElementById('editBrand').value,
        description: document.getElementById('editDescription').value,
        stock: Number(document.getElementById('editStock').value),
        imageUrl: document.getElementById('editImageUrl').value
      };

      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error('Update failed');

        alert('Product updated! Changes will show on the customer dashboard.');
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        allProducts = await fetchProducts();
        renderTable(allProducts);

      } catch (error) {
        alert('Failed to update product.');
        console.error(error);
      }
    });
  }
}

function setupDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this product? This will also remove it from the customer dashboard.')) return;

      const id = btn.getAttribute('data-id');
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Delete failed');

        alert('Product deleted successfully!');
        allProducts = await fetchProducts();
        renderTable(allProducts);

      } catch (error) {
        alert('Failed to delete product.');
        console.error(error);
      }
    });
  });
}

window.onload = async function () {
  allProducts = await fetchProducts();
  renderTable(allProducts);
  setupSearch();
  setupAddProduct();
};
