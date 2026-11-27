# Shoepify Backend

## 📌 Overview

This is the backend of Shoepify, an online shoe shop system built using Node.js, Express, and MongoDB. It provides REST API endpoints for managing users, products, orders, categories, cart, reviews, and payments.

## 📂 Models

The following models are used in this project:

- User
- Product
- Order
- Category
- Cart
- Review
- Payment

## 🔗 API Routes

### Users

- POST /api/users - Create a new user
- GET /api/users - Get all users
- PUT /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user

### Products

- POST /api/products - Add product
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Orders

- POST /api/orders - Create order
- GET /api/orders - Get all orders
- PUT /api/orders/:id - Update order status
- DELETE /api/orders/:id - Delete order

### Categories

- POST /api/categories - Add category
- GET /api/categories - Get categories

### Cart

- POST /api/cart - Add to cart
- GET /api/cart - Get cart items
- DELETE /api/cart/:id - Remove cart item by item ID

### Reviews

- POST /api/reviews - Add review
- GET /api/reviews - Get reviews

### Payments

- POST /api/payments - Process payment
- GET /api/payments - Get payment history

## 🔌 Database Connection

MongoDB is connected using Mongoose.

Example connection string (in `.env` file):
