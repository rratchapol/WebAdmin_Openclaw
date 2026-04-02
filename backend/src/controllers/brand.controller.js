const Brand = require('../models/brand.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getBrands = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};

  const [brands, total] = await Promise.all([
    Brand.find(query).skip(skip).limit(Number(limit)).lean(),
    Brand.countDocuments(query),
  ]);
  sendSuccess(res, { brands, total, page: Number(page), limit: Number(limit) });
});

exports.getBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id).lean();
  if (!brand) throw new AppError('Brand not found', 404);
  sendSuccess(res, { brand });
});

exports.createBrand = asyncHandler(async (req, res) => {
  const { name, description, logo, slug } = req.body;
  const brand = await Brand.create({ name, description, logo, slug: slug || name });
  sendSuccess(res, { brand }, 'Brand created', 201);
});

exports.updateBrand = asyncHandler(async (req, res) => {
  const { name, description, logo, isActive } = req.body;
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw new AppError('Brand not found', 404);

  if (name) brand.name = name;
  if (description !== undefined) brand.description = description;
  if (logo !== undefined) brand.logo = logo;
  if (isActive !== undefined) brand.isActive = isActive;
  await brand.save();

  sendSuccess(res, { brand }, 'Brand updated');
});

exports.deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) throw new AppError('Brand not found', 404);
  sendSuccess(res, {}, 'Brand deleted');
});
