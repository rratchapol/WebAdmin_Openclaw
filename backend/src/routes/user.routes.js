const router = require('express').Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/',        getUsers);
router.post('/',       createUser);
router.get('/:id',     getUser);
router.put('/:id',     updateUser);
router.delete('/:id',  deleteUser);

module.exports = router;
