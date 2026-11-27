const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://shoe-pify-sqdg.onrender.com/api';

// Show/hide address field based on role
document.querySelectorAll('input[name="role"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const addressField = document.getElementById('addressField');
    if (this.value === 'admin') {
      addressField.style.display = 'none';
    } else {
      addressField.style.display = 'block';
    }
  });
});

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
 const role = 'customer';
  const address = document.getElementById('address').value.trim();

  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');
  const btn = document.getElementById('registerBtn');

  errorMsg.classList.add('d-none');
  successMsg.classList.add('d-none');

  // Validation
  if (!name || !email || !password) {
    errorMsg.textContent = 'Please fill in all required fields!';
    errorMsg.classList.remove('d-none');
    return;
  }

  if (role === 'customer' && !address) {
    errorMsg.textContent = 'Please enter your delivery address!';
    errorMsg.classList.remove('d-none');
    return;
  }

  btn.textContent = 'Registering...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, address })
    });

    const data = await res.json();

    if (res.ok) {
      successMsg.textContent = 'Account created successfully! Redirecting to login...';
      successMsg.classList.remove('d-none');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      // Intercept raw MongoDB duplicate key error and show friendly message
      const isDuplicate =
        (data.message && data.message.includes('E11000')) ||
        (data.message && data.message.includes('duplicate key'));

      errorMsg.textContent = isDuplicate
        ? 'This email is already registered. Please login instead.'
        : data.message || 'Registration failed. Try again.';

      errorMsg.classList.remove('d-none');
      btn.textContent = 'Register';
      btn.disabled = false;
    }

  } catch (error) {
    errorMsg.textContent = 'Unable to connect. Please check your connection and try again.';
    errorMsg.classList.remove('d-none');
    btn.textContent = 'Register';
    btn.disabled = false;
    console.error(error);
  }
});
