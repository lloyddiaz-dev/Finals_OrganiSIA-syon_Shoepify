<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1

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