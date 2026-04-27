const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create an order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('user').populate('products.product');
  res.json(orders);
});

// Get orders by user
router.get('/user/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).populate('products.product');
  res.json(orders);
});

// Update order status
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// Update delivery info
router.put('/:id/delivery', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// Delete order
router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
});

module.exports = router;