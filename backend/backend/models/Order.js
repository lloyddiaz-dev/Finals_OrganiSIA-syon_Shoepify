const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
 user: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      size: { type: String },        
      name: { type: String },       
      price: { type: Number },     
      image: { type: String }       
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, shipped, delivered
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String },
  deliveryDate: { type: Date },
  trackingNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);