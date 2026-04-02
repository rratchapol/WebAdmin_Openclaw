const router = require('express').Router();
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/',       getOrders);
router.get('/:id',    getOrder);
router.post('/',      createOrder);
router.put('/:id',    updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
