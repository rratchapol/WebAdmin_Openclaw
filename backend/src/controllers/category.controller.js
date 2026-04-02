const Category = require('../models/category.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const buildQuery = (search) =>
  search ? { name: { $regex: search, $options: 'i' } } : {};

exports.getCategories = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const query = buildQuery(search);

  const [categories, total] = await Promise.all([
    Category.find(query).skip(skip).limit(Number(limit)).lean(),
    Category.countDocuments(query),
  ]);
  sendSuccess(res, { categories, total, page: Number(page), limit: Number(limit) });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).lean();
  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, { category });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, slug } = req.body;
  const category = await Category.create({ name, description, slug: slug || name });
  sendSuccess(res, { category }, 'Category created', 201);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;
  await category.save();

  sendSuccess(res, { category }, 'Category updated');
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, {}, 'Category deleted');
});
