const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true },
  size: { type: [Number] },       // available shoe sizes
  color: { type: String },
  stock: { type: Number, default: 0 },
  description: { type: String },
  imageUrl: { type: String },     // product image
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // optional
});

module.exports = mongoose.model('Product', productSchema);