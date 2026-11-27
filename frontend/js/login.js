<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> f845d963f14885bbb71ef35cd49b7ae87fcadeb1

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const btn = document.getElementById('loginBtn');

  errorMsg.classList.add('d-none');
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save user info to localStorage
      localStorage.setItem('shoepify_user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    } else {
      errorMsg.textContent = data.message || 'Invalid email or password.';
      errorMsg.classList.remove('d-none');
      btn.textContent = 'Login';
      btn.disabled = false;
    }

  } catch (error) {
    errorMsg.textContent = 'Server error. Make sure the backend is running.';
    errorMsg.classList.remove('d-none');
    btn.textContent = 'Login';
    btn.disabled = false;
    console.error(error);
  }
});
