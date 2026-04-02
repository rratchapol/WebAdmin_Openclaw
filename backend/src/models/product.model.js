const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    comparePrice:{ type: Number, default: 0 },
    images:      [{ type: String }],
    category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // ทำเป็น Optional เพื่อให้ง่ายต่อการบันทึกข้อมูลด่วน
    brand:       { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    stock:       { type: Number, default: 0, min: 0 },
    sku:         { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

// ต้องเปลี่ยนจาก pre('save') เป็น pre('validate') เพื่อให้มันสร้าง slug ก่อนที่จะถูกตรวจว่า error
productSchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
