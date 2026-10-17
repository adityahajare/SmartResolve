const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/User');
const { success, error } = require('../utils/apiResponse');
const emailService = require('../services/email.service');

const signTokens = (userId) => ({
  accessToken:  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' }),
  refreshToken: jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' })
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyId } = req.body;
    if (await User.findOne({ email })) return error(res, 'Email already registered', 409);
    const user = await User.create({ name, email, password, role: role || 'customer', companyId });
    const { accessToken, refreshToken } = signTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    await emailService.sendWelcomeEmail(user);
    success(res, { user, accessToken, refreshToken }, 'Registered successfully', 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return error(res, 'Invalid credentials', 401);
    if (!user.isActive) return error(res, 'Account deactivated', 401);
    const { accessToken, refreshToken } = signTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin    = new Date();
    await user.save({ validateBeforeSave: false });
    success(res, { user, accessToken, refreshToken }, 'Login successful');
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    success(res, {}, 'Logged out');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return error(res, 'Invalid refresh token', 401);
    const tokens = signTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });
    success(res, tokens);
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return error(res, 'No account with that email');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetOTP    = otp;
    user.passwordResetExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    await emailService.sendPasswordReset(user, otp);
    success(res, {}, 'OTP sent to email');
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email, passwordResetOTP: otp, passwordResetExpiry: { $gt: Date.now() } });
    if (!user) return error(res, 'Invalid or expired OTP');
    user.password            = password;
    user.passwordResetOTP    = null;
    user.passwordResetExpiry = null;
    await user.save();
    success(res, {}, 'Password reset successful');
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ emailVerifyToken: req.params.token }, { emailVerified: true, emailVerifyToken: null }, { new: true });
    if (!user) return error(res, 'Invalid token');
    success(res, {}, 'Email verified');
  } catch (err) { next(err); }
};
