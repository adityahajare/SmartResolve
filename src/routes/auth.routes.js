const express = require('express');
const router  = express.Router();
const { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',       register);
router.post('/login',          login);
router.post('/logout',         protect, logout);
router.post('/refresh-token',  refreshToken);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
