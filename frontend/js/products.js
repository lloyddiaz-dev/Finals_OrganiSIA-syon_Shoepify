const API_BASE = 'http://localhost:5000/api';
let allProducts = [];

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (error) {
    showError('Failed to load products. Make sure the backend server is running.');
    console.error('Fetch error:', error);
    return [];
  }
}

function buildCards(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-3">No products found.</div>`;
    return;
  }

  // Get current cart to check what's already added
  const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';

    const brand = product.brand || 'Unknown Brand';
    const color = product.color || 'N/A';
    const image = product.imageUrl || 'img/NikeAirMax.jpeg';
    const category = product.category?.name || 'Uncategorized';
    const sizes = product.size?.length > 0 ? product.size.join(', ') : 'No sizes listed';

    const alreadyInCart = cart.some(item => item.id === product._id);
    const outOfStock = product.stock === 0;

    let btnText = 'Add to Cart';
    let btnClass = 'btn-danger';
    let btnDisabled = '';

    if (outOfStock) {
      btnText = 'Out of Stock';
      btnClass = 'btn-secondary';
      btnDisabled = 'disabled';
    } else if (alreadyInCart) {
      btnText = '✓ In Cart';
      btnClass = 'btn-success';
      btnDisabled = 'disabled';
    }

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
          <button
            class="btn ${btnClass} w-100 mt-2 add-to-cart-btn"
            data-id="${product._id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${image}"
            data-stock="${product.stock}"
            ${btnDisabled}
          >
            ${btnText}
          </button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  setupAddToCart();
}

function renderProducts(products) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';

  // First 20 = Men's, Last 20 = Women's
  const mensProducts = products.slice(0, 20);
  const womensProducts = products.slice(20);

  buildCards(mensProducts, 'mensList');
  buildCards(womensProducts, 'womensList');
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    const menTitle = document.getElementById('mensSectionTitle');
    const womenTitle = document.getElementById('womensSectionTitle');

    if (keyword === '') {
      renderProducts(allProducts);
      if (menTitle) menTitle.textContent = "Men's Shoes";
      if (womenTitle) womenTitle.style.display = 'block';
      return;
    }

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      (p.brand && p.brand.toLowerCase().includes(keyword))
    );

    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';

    buildCards(filtered, 'mensList');
    if (menTitle) menTitle.textContent = 'Search Results';
    document.getElementById('womensList').innerHTML = '';
    if (womenTitle) womenTitle.style.display = 'none';
  });
}

function setupAddToCart() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const product = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: Number(btn.getAttribute('data-price')),
        image: btn.getAttribute('data-image'),
        stock: Number(btn.getAttribute('data-stock')),
        qty: 1
      };

      // Get existing cart from localStorage
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');

      // Prevent adding same product twice
      const alreadyInCart = cart.some(item => item.id === product.id);
      if (alreadyInCart) {
        btn.textContent = '✓ In Cart';
        btn.className = 'btn btn-success w-100 mt-2 add-to-cart-btn';
        btn.disabled = true;
        return;
      }

      // Add to cart
      cart.push(product);
      localStorage.setItem('shoepify_cart', JSON.stringify(cart));

      // Reduce stock in backend via PUT
      try {
        const newStock = product.stock - 1;
        await fetch(`${API_BASE}/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: newStock })
        });
        // Update stock badge on card
        const badge = btn.closest('.card-body').querySelector('.badge');
        if (badge && newStock > 0) {
          badge.textContent = `In Stock (${newStock})`;
        } else if (badge && newStock === 0) {
          badge.textContent = 'Out of Stock';
          badge.className = 'badge bg-danger';
        }
      } catch (err) {
        console.error('Stock update failed:', err);
      }

      // Update button state
      btn.textContent = '✓ In Cart';
      btn.className = 'btn btn-success w-100 mt-2 add-to-cart-btn';
      btn.disabled = true;

      // Update cart count in navbar
      updateCartCount();
    });
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
  const total = cart.length; // number of unique products
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = total > 0 ? `(${total})` : '';
}

function showError(message) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';
  const container = document.getElementById('mensList');
  if (container) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-danger">${message}</div></div>`;
  }
}

window.onload = async function () {
  allProducts = await fetchProducts();
  renderProducts(allProducts);
  setupSearch();
  updateCartCount();
};
