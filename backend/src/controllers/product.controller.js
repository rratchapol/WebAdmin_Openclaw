const Product = require('../models/product.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

// ─── GET All Products ─────────────────────────────────────────────────────────
exports.getProducts = asyncHandler(async (req, res) => {
  const { search = '', category, brand, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }];
  if (category) query.category = category;
  if (brand)    query.brand = brand;

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  sendSuccess(res, { products, total, page: Number(page), limit: Number(limit) });
});

// ─── GET Single Product ───────────────────────────────────────────────────────
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('brand', 'name slug logo')
    .lean();
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, { product });
});

// ─── CREATE Product ───────────────────────────────────────────────────────────
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, comparePrice, images, category, brand, stock, sku, tags } = req.body;
  const product = await Product.create({ name, description, price, comparePrice, images, category, brand, stock, sku, tags });
  await product.populate('category brand');
  sendSuccess(res, { product }, 'Product created', 201);
});

// ─── UPDATE Product ───────────────────────────────────────────────────────────
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  ).populate('category', 'name slug').populate('brand', 'name slug logo');

  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, { product }, 'Product updated');
});

// ─── DELETE Product ───────────────────────────────────────────────────────────
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, {}, 'Product deleted');
});
