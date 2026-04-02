const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const { asyncHandler, AppError } = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Get All Users ────────────────────────────────────────────────────────────
exports.getUsers = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(query),
  ]);

  sendSuccess(res, { users, total, page: Number(page), limit: Number(limit) });
});

// ─── Get Single User ──────────────────────────────────────────────────────────
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, { user });
});

// ─── Update User ──────────────────────────────────────────────────────────────
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isActive, avatar },
    { new: true, runValidators: true }
  ).lean();

  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, { user }, 'User updated');
});

// ─── Create User ──────────────────────────────────────────────────────────────
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already in use', 400);

  const user = await User.create({ name, email, password, role, isActive });
  sendSuccess(res, { user }, 'User created successfully', 201);
});

// ─── Delete User ──────────────────────────────────────────────────────────────
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, {}, 'User deleted');
});
