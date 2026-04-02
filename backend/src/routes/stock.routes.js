const router = require('express').Router();
const { getStocks, getStockHistory, adjustStock } = require('../controllers/stock.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/',                    getStocks);
router.get('/:id/history',         getStockHistory);
router.patch('/:id/adjust',        adjustStock);

module.exports = router;
