const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    type:     { type: String, enum: ['in', 'out', 'adjust'], required: true },
    quantity: { type: Number, required: true },
    before:   { type: Number, required: true },
    after:    { type: Number, required: true },
    note:     { type: String, default: '' },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockLog', stockLogSchema);
