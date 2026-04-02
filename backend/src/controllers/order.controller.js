const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

// ─── GET All Orders ───────────────────────────────────────────────────────────
exports.getOrders = asyncHandler(async (req, res) => {
  const { status, search = '', page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (status && ORDER_STATUSES.includes(status)) query.status = status;
  if (search) {
    query.$or = [
      { orderNo: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments(query),
  ]);

  sendSuccess(res, { orders, total, page: Number(page), limit: Number(limit) });
});

// ─── GET Single Order ─────────────────────────────────────────────────────────
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images sku')
    .lean();
  if (!order) throw new AppError('Order not found', 404);
  sendSuccess(res, { order });
});

// ─── CREATE Order ─────────────────────────────────────────────────────────────
exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, items, discount = 0, shippingAddress, note } = req.body;

  if (!items || items.length === 0) throw new AppError('Order must have at least 1 item', 400);

  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(subtotal - discount, 0);

  const order = await Order.create({
    customer,
    items,
    subtotal,
    discount,
    total,
    shippingAddress,
    note,
    createdBy: req.user._id,
  });

  sendSuccess(res, { order }, 'Order created', 201);
});

// ─── UPDATE Order Status ──────────────────────────────────────────────────────
exports.updateOrder = asyncHandler(async (req, res) => {
  const { status, note, shippingAddress } = req.body;

  if (status && !ORDER_STATUSES.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`, 400);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(note !== undefined && { note }), ...(shippingAddress && { shippingAddress }) },
    { new: true, runValidators: true }
  );

  if (!order) throw new AppError('Order not found', 404);
  sendSuccess(res, { order }, 'Order updated');
});

// ─── DELETE Order ─────────────────────────────────────────────────────────────
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new AppError('Order not found', 404);
  sendSuccess(res, {}, 'Order deleted');
});
