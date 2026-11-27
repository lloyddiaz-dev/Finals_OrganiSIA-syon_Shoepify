<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1

function openAddModal() {
  document.getElementById('productModalLabel').textContent = 'Add Product';
  document.getElementById('productForm').reset();
  document.getElementById('saveProductBtn').onclick = addProduct;
  // Show modal
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

function editProduct(id) {
  // Fetch product details and populate form
  fetch(`${API_BASE}/products/${id}`)
    .then(res => res.json())
    .then(product => {
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productModalLabel').textContent = 'Edit Product';
      document.getElementById('saveProductBtn').onclick = () => updateProduct(id);
      new bootstrap.Modal(document.getElementById('productModal')).show();
    })
    .catch(error => console.error('Error fetching product:', error));
}

function addProduct() {
  const data = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    description: document.getElementById('productDescription').value
  };
  fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    location.reload(); // Refresh the page to show updated products
  })
  .catch(error => console.error('Error adding product:', error));
}

function updateProduct(id) {
  const data = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    description: document.getElementById('productDescription').value
  };
  fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    location.reload();
  })
  .catch(error => console.error('Error updating product:', error));
}