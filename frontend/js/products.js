const API_BASE = 'http://localhost:5000/api';
let allProducts = [];
 
const DEFAULT_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const PRODUCTS_PER_PAGE = 8;
 
let filteredProducts = [];
let currentPage = 1;
let activeGender = 'all';
let activeType   = 'all';
let currentSearch = '';
 
// ── FETCH ─────────────────────────────────────────────────
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
 
// ── FILTERS ───────────────────────────────────────────────
function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    const matchGender = activeGender === 'all' || p.gender === activeGender;
    const matchType   = activeType   === 'all' || p.type   === activeType;
    const q           = currentSearch.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q));
    return matchGender && matchType && matchSearch;
  });
  currentPage = 1;
  renderPage();
}
 
// ── RENDER PAGE ───────────────────────────────────────────
function renderPage() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';
 
  const total      = filteredProducts.length;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const start      = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pageItems  = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
 
  // Results count
  const countEl = document.getElementById('resultsCount');
  if (countEl) {
    countEl.textContent = total > 0
      ? `Showing ${start + 1}–${Math.min(start + PRODUCTS_PER_PAGE, total)} of ${total} products`
      : '';
  }
 
  const menSection   = document.getElementById('mensSectionWrapper');
  const womenSection = document.getElementById('womensSectionWrapper');
  const noResults    = document.getElementById('noResults');
  const menTitle     = document.getElementById('mensSectionTitle');
  const womenTitle   = document.getElementById('womensSectionTitle');
 
  if (total === 0) {
    if (menSection)   menSection.style.display   = 'none';
    if (womenSection) womenSection.style.display = 'none';
    if (noResults)    noResults.style.display    = 'block';
    renderPagination(0);
    return;
  }
  if (noResults) noResults.style.display = 'none';
 
  if (activeGender === 'men') {
    if (menSection)   { menSection.style.display = 'block'; buildCards(pageItems, 'mensList'); }
    if (womenSection) womenSection.style.display = 'none';
    if (menTitle)     menTitle.textContent = buildLabel("Men's");
  } else if (activeGender === 'women') {
    if (womenSection) { womenSection.style.display = 'block'; buildCards(pageItems, 'womensList'); }
    if (menSection)   menSection.style.display = 'none';
    if (womenTitle)   womenTitle.textContent = buildLabel("Women's");
  } else {
    // Show both sections split by gender
    // Products with no gender yet go into men's section as fallback
    const mens   = pageItems.filter(p => p.gender === 'men'   || !p.gender);
    const womens = pageItems.filter(p => p.gender === 'women');
    if (menSection)   menSection.style.display   = mens.length   ? 'block' : 'none';
    if (womenSection) womenSection.style.display = womens.length ? 'block' : 'none';
    if (menTitle)     menTitle.textContent   = "Men's Shoes";
    if (womenTitle)   womenTitle.textContent = "Women's Shoes";
    buildCards(mens,   'mensList');
    buildCards(womens, 'womensList');
  }
 
  renderPagination(totalPages);
}
 
function buildLabel(gender) {
  const t = activeType !== 'all'
    ? activeType.charAt(0).toUpperCase() + activeType.slice(1)
    : 'Shoes';
  return `${gender} ${t}`;
}
 
// ── BUILD CARDS ───────────────────────────────────────────
function buildCards(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
 
  if (products.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-3">No products found.</div>`;
    return;
  }
 
  const cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
 
  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';
 
    const brand        = product.brand    || 'Unknown Brand';
    const image        = product.imageUrl || 'img/NikeAirMax.jpeg';
    const sizes        = product.size?.length > 0 ? product.size : DEFAULT_SIZES;
    const typeLabel    = product.type   ? product.type.charAt(0).toUpperCase()   + product.type.slice(1)   : 'Shoes';
    const genderLabel  = product.gender === 'men' ? "Men's" : product.gender === 'women' ? "Women's" : '';
    const alreadyInCart = cart.some(item => item.id === product._id);
    const outOfStock   = product.stock === 0;
 
    let btnText = 'Add to Cart', btnClass = 'btn-danger', btnDisabled = '';
    if (outOfStock)     { btnText = 'Out of Stock'; btnClass = 'btn-secondary'; btnDisabled = 'disabled'; }
    else if (alreadyInCart) { btnText = '✓ In Cart'; btnClass = 'btn-success'; btnDisabled = 'disabled'; }
 
    const stockBadge = product.stock > 0
      ? `<span class="badge bg-success">In Stock (${product.stock})</span>`
      : `<span class="badge bg-danger">Out of Stock</span>`;
 
    const sizeButtons = sizes.map(s => `
      <button class="size-btn btn btn-sm btn-outline-secondary me-1 mb-1"
        data-size="${s}" style="min-width:38px; font-size:12px;">${s}</button>
    `).join('');
 
    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card">
        <img src="${image}" class="card-img-top" alt="${product.name}"
          style="height:200px; object-fit:cover;"
          onerror="this.src='img/NikeAirMax.jpeg'">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title fw-bold">${product.name}</h6>
          <p class="text-muted small mb-1">${brand}</p>
          <p class="mb-2">
            ${genderLabel ? `<span class="badge bg-secondary me-1">${genderLabel}</span>` : ''}
            <span class="badge bg-danger">${typeLabel}</span>
          </p>
          <p class="card-text small">${product.description || ''}</p>
          <div class="mb-2">
            <p class="small fw-bold mb-1">Size: <span class="selected-size text-danger"></span></p>
            <div class="size-options">${sizeButtons}</div>
          </div>
          <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-danger fs-5">₱${product.price.toLocaleString()}</span>
            ${stockBadge}
          </div>
          <button class="btn ${btnClass} w-100 mt-2 add-to-cart-btn"
            data-id="${product._id}" data-name="${product.name}"
            data-price="${product.price}" data-image="${image}"
            data-stock="${product.stock}" ${btnDisabled}>
            ${btnText}
          </button>
        </div>
      </div>`;
    container.appendChild(col);
  });
 
  setupSizeButtons();
  setupAddToCart();
}
 
// ── SIZE ──────────────────────────────────────────────────
function setupSizeButtons() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.size-options').querySelectorAll('.size-btn').forEach(s => {
        s.classList.remove('btn-danger', 'text-white');
        s.classList.add('btn-outline-secondary');
      });
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-danger', 'text-white');
      const label = btn.closest('.card-body').querySelector('.selected-size');
      if (label) label.textContent = btn.getAttribute('data-size');
    });
  });
}
 
// ── ADD TO CART ───────────────────────────────────────────
function setupAddToCart() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cardBody    = btn.closest('.card-body');
      const selectedSize = cardBody.querySelector('.selected-size')?.textContent?.trim();
      if (!selectedSize) { alert('Please select a size first!'); return; }
 
      const product = {
        id:    btn.getAttribute('data-id'),
        name:  btn.getAttribute('data-name'),
        price: Number(btn.getAttribute('data-price')),
        image: btn.getAttribute('data-image'),
        stock: Number(btn.getAttribute('data-stock')),
        size:  selectedSize,
        qty:   1
      };
 
      let cart = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
      if (cart.some(item => item.id === product.id)) {
        btn.textContent = '✓ In Cart'; btn.className = 'btn btn-success w-100 mt-2 add-to-cart-btn'; btn.disabled = true;
        return;
      }
 
      cart.push(product);
      localStorage.setItem('shoepify_cart', JSON.stringify(cart));
 
      try {
        const newStock = product.stock - 1;
        await fetch(`${API_BASE}/products/${product.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: newStock })
        });
        const badge = cardBody.querySelector('.badge.bg-success, .badge.bg-danger');
        if (badge && newStock > 0) { badge.textContent = `In Stock (${newStock})`; badge.className = 'badge bg-success'; }
        else if (badge)            { badge.textContent = 'Out of Stock'; badge.className = 'badge bg-danger'; }
      } catch (err) { console.error('Stock update failed:', err); }
 
      btn.textContent = '✓ In Cart'; btn.className = 'btn btn-success w-100 mt-2 add-to-cart-btn'; btn.disabled = true;
      updateCartCount();
    });
  });
}
 
// ── PAGINATION ────────────────────────────────────────────
function renderPagination(totalPages) {
  const wrapper = document.getElementById('paginationWrapper');
  if (!wrapper) return;
  if (totalPages <= 1) { wrapper.innerHTML = ''; return; }
 
  let html = `<nav aria-label="Product pages"><ul class="pagination justify-content-center flex-wrap">`;
  html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
    <button class="page-link" onclick="goToPage(${currentPage - 1})">&#8592; Prev</button></li>`;
 
  let startP = Math.max(1, currentPage - 2);
  let endP   = Math.min(totalPages, startP + 4);
  if (endP - startP < 4) startP = Math.max(1, endP - 4);
 
  if (startP > 1) {
    html += `<li class="page-item"><button class="page-link" onclick="goToPage(1)">1</button></li>`;
    if (startP > 2) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
  }
  for (let i = startP; i <= endP; i++) {
    html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <button class="page-link" onclick="goToPage(${i})">${i}</button></li>`;
  }
  if (endP < totalPages) {
    if (endP < totalPages - 1) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
    html += `<li class="page-item"><button class="page-link" onclick="goToPage(${totalPages})">${totalPages}</button></li>`;
  }
 
  html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
    <button class="page-link" onclick="goToPage(${currentPage + 1})">Next &#8594;</button></li>`;
  html += `</ul></nav><p class="text-center text-muted small">Page ${currentPage} of ${totalPages}</p>`;
  wrapper.innerHTML = html;
}
 
function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
 
// ── SEARCH ────────────────────────────────────────────────
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  searchInput.addEventListener('input', function () {
    currentSearch = this.value;
    applyFilters();
  });
}
 
// ── CART COUNT ────────────────────────────────────────────
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('shoepify_cart') || '[]');
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.length > 0 ? `(${cart.length})` : '';
}
 
function showError(msg) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';
  const el = document.getElementById('mensList');
  if (el) el.innerHTML = `<div class="col-12"><div class="alert alert-danger">${msg}</div></div>`;
}
 
// ── INIT ──────────────────────────────────────────────────
window.onload = async function () {
  allProducts = await fetchProducts();
  applyFilters();
  setupSearch();
  updateCartCount();
 
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn').forEach(b => {
        b.classList.remove('btn-danger'); b.classList.add('btn-outline-danger');
      });
      btn.classList.remove('btn-outline-danger'); btn.classList.add('btn-danger');
      activeGender = btn.dataset.gender;
      applyFilters();
    });
  });
 
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => {
        b.classList.remove('btn-dark'); b.classList.add('btn-outline-dark');
      });
      btn.classList.remove('btn-outline-dark'); btn.classList.add('btn-dark');
      activeType = btn.dataset.type;
      applyFilters();
    });
  });
};
