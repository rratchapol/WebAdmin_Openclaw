const router = require('express').Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/',       getCategories);
router.get('/:id',    getCategory);
router.post('/',      createCategory);
router.put('/:id',    updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
