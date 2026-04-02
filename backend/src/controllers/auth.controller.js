const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── Validation Rules ────────────────────────────────────────────────────────
exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 422);

  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 409);

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  sendSuccess(res, { user, token }, 'Registered successfully', 201);
});

// ─── Login ───────────────────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, errors.array()[0].msg, 422);

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  const token = generateToken(user._id);
  const userObj = user.toJSON(); // strips password

  sendSuccess(res, { user: userObj, token }, 'Login successful');
});

// ─── Get Me ──────────────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user }, 'User profile retrieved');
});
