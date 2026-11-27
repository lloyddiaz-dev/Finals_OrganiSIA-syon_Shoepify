const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart by user
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
  res.json(cart);
});

// Add or update cart
router.post('/:userId', async (req, res) => {
  let cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) {
    cart = new Cart({ user: req.params.userId, items: req.body.items });
  } else {
    cart.items = req.body.items;
  }
  await cart.save();
  res.json(cart);
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  await Cart.findOneAndDelete({ user: req.params.userId });
  res.json({ message: 'Cart cleared' });
});

module.exports = router;