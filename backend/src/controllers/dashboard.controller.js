const Product = require('../models/product.model');
const Order   = require('../models/order.model');
const User    = require('../models/user.model');
const Category = require('../models/category.model');
const Brand   = require('../models/brand.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendSuccess }  = require('../utils/response');

exports.getDashboard = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalCategories,
    totalBrands,
    revenueData,
    recentOrders,
    lowStockProducts,
    orderStatusCounts,
  ] = await Promise.all([
    // Counts
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments(),
    Category.countDocuments({ isActive: true }),
    Brand.countDocuments({ isActive: true }),

    // Total revenue from completed orders
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),

    // Recent 5 orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNo customer.name total status createdAt')
      .lean(),

    // Low stock (stock <= 10)
    Product.find({ stock: { $lte: 10 }, isActive: true })
      .sort({ stock: 1 })
      .limit(5)
      .select('name stock sku images')
      .lean(),

    // Order count by status
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  // Format orderStatusCounts into an object
  const statusMap = {};
  orderStatusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

  sendSuccess(res, {
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      totalBrands,
      totalRevenue,
    },
    recentOrders,
    lowStockProducts,
    orderStatusCounts: statusMap,
  });
});
