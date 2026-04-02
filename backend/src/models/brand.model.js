const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, unique: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    logo:        { type: String, default: '' },
    description: { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

brandSchema.pre('validate', function (next) {
  if (this.isModified('name')) {
    let cleanSlug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    this.slug = cleanSlug || Date.now().toString(); // ถัาเป็นภาษาไทยล้วน โค้ดเก่าจะลบทิ้งจนว่างเปล่า ให้ใช้ Date แทน
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
