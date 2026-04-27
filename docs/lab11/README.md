# Lab 11: Frontend Implementation

## What Was Implemented This Week

This week, we implemented the complete frontend for the ShoePify e-commerce website. The frontend includes:

- **User-facing pages**: index.html (home page), products.html (product catalog), cart.html (shopping cart), orders.html (order history), profile.html (user profile), login.html (user login), register.html (user registration)
- **Admin pages**: admin.html (admin dashboard), orders-admin.html (order management), products.html (product management with admin features)
- **Styling**: style.css for consistent design across all pages
- **JavaScript functionality**: login.js, register.js, script.js for interactive features like form validation, cart management, and dynamic content loading

The frontend provides a complete user experience for browsing shoes, managing shopping carts, placing orders, and user account management, as well as administrative tools for managing products and orders.

## How It Aligns with the Use Case/ERD

The frontend implementation directly supports the core use cases of the ShoePify system:

- **Customer Use Cases**: 
  - Browse and search products (products.html)
  - Add items to cart and checkout (cart.html, orders.html)
  - User registration and authentication (register.html, login.html)
  - View order history and manage profile (orders.html, profile.html)

- **Admin Use Cases**:
  - Manage products (admin.html, products.html)
  - Process and manage orders (orders-admin.html)

This aligns with the Entity-Relationship Diagram (ERD) by providing interfaces for all major entities:
- User management (registration, login, profile)
- Product catalog and management
- Shopping cart functionality
- Order processing and history
- Category browsing
- Review system integration
- Payment processing interfaces

The frontend connects to the backend API endpoints for seamless data flow between the user interface and the database models (User, Product, Order, Category, Cart, Review, Payment).