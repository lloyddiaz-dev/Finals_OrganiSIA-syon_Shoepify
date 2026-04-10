const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create a product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
});

// Search products
// Example: GET /api/products/search?name=Air&brand=Nike
router.get('/search', async (req, res) => {
  const { name, brand } = req.query;
  const query = {};
  if (name) query.name = { $regex: name, $options: 'i' }; // case-insensitive
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  const products = await Product.find(query).populate('category');
  res.json(products);
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.json(product);
});

// Update product
router.put('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Delete product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;