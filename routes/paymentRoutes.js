const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Add a payment
router.post('/', async (req, res) => {
  const payment = new Payment(req.body);
  await payment.save();
  res.status(201).json(payment);
});

// Get payments for an order
router.get('/order/:orderId', async (req, res) => {
  const payments = await Payment.find({ order: req.params.orderId });
  res.json(payments);
});

// Update payment status
router.put('/:id', async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(payment);
});

module.exports = router;