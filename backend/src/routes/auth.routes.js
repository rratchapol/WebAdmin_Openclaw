const router = require('express').Router();
const { register, login, getMe, registerRules, loginRules } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerRules, register);
router.post('/login',    loginRules,    login);
router.get('/me',        protect,       getMe);

module.exports = router;
