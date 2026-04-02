const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, unique: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name before save (Fixed for Thai language)
categorySchema.pre('validate', function (next) {
  if (this.isModified('name')) {
    let cleanSlug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    this.slug = cleanSlug || Date.now().toString(); // ถัาเป็นภาษาไทยล้วน โค้ดเก่าจะลบทิ้งจนว่างเปล่า ให้ใช้ Date แทน
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
