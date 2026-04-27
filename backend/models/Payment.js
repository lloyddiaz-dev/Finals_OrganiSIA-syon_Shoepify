const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // Credit Card, PayPal, etc.
  status: { type: String, default: 'pending' }, // pending, completed, failed
  paidAt: { type: Date }
});

module.exports = mongoose.model('Payment', paymentSchema);