const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Add a review
router.post('/', async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.status(201).json(review);
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user');
  res.json(reviews);
});

// Delete a review
router.delete('/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

module.exports = router;