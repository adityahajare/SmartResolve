const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Notification = require('../models/Notification');
const { success }  = require('../utils/apiResponse');

router.use(protect);

router.get('/',          async (req, res) => { const n = await Notification.find({ userId: req.user._id }).sort('-createdAt').limit(50); success(res, n); });
router.patch('/read-all',async (req, res) => { await Notification.updateMany({ userId: req.user._id }, { isRead: true }); success(res, {}, 'All marked read'); });
router.patch('/:id/read',async (req, res) => { await Notification.findByIdAndUpdate(req.params.id, { isRead: true }); success(res, {}, 'Marked read'); });
router.delete('/:id',    async (req, res) => { await Notification.findByIdAndDelete(req.params.id); success(res, {}, 'Deleted'); });

module.exports = router;
