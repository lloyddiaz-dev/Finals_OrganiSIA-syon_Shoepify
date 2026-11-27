const API_BASE = 'http://localhost:5000/api';

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        location.reload(); // Refresh to show updated list
      } else {
        alert('Failed to delete product');
      }
    })
    .catch(error => console.error('Error deleting product:', error));
  }
}