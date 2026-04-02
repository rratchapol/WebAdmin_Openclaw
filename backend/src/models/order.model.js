const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNo:   { type: String, unique: true },
    customer:  {
      name:  { type: String, required: true },
      email: { type: String },
      phone: { type: String },
    },
    items:     [orderItemSchema],
    subtotal:  { type: Number, required: true },
    discount:  { type: Number, default: 0 },
    total:     { type: Number, required: true },
    status:    {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      address: String,
      city:    String,
      zip:     String,
    },
    note:      { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNo) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNo = `ORD-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
