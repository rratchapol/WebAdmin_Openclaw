const Product = require('../models/product.model');
const StockLog = require('../models/stock.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

// ─── GET All Stock (Products with stock info) ─────────────────────────────────
exports.getStocks = asyncHandler(async (req, res) => {
  const { search = '', lowStock, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (lowStock === 'true') query.stock = { $lte: 10 };

  const [products, total] = await Promise.all([
    Product.find(query, 'name sku stock images isActive category brand')
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort({ stock: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  sendSuccess(res, { stocks: products, total, page: Number(page), limit: Number(limit) });
});

// ─── GET Stock History for a Product ─────────────────────────────────────────
exports.getStockHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const product = await Product.findById(req.params.id).lean();
  if (!product) throw new AppError('Product not found', 404);

  const [logs, total] = await Promise.all([
    StockLog.find({ product: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    StockLog.countDocuments({ product: req.params.id }),
  ]);

  sendSuccess(res, { product, logs, total });
});

// ─── Adjust Stock ─────────────────────────────────────────────────────────────
exports.adjustStock = asyncHandler(async (req, res) => {
  const { quantity, type = 'adjust', note = '' } = req.body;
  if (!quantity || typeof quantity !== 'number') throw new AppError('quantity must be a number', 400);

  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const before = product.stock;
  let after = before;

  if (type === 'in')     after = before + Math.abs(quantity);
  else if (type === 'out') {
    after = before - Math.abs(quantity);
    if (after < 0) throw new AppError('Insufficient stock', 400);
  } else {
    // adjust = set directly
    after = quantity;
  }

  product.stock = after;
  await product.save();

  await StockLog.create({
    product: product._id,
    type,
    quantity,
    before,
    after,
    note,
    createdBy: req.user._id,
  });

  sendSuccess(res, { product: { _id: product._id, name: product.name, stock: after }, before, after }, 'Stock adjusted');
});
