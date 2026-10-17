const express = require('express');
const router  = express.Router();
const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const Incident = require('../models/Incident');
const Ticket   = require('../models/Ticket');
const { success } = require('../utils/apiResponse');

router.use(protect);

router.get('/', async (req, res) => {
  const incidents = await Incident.find({ companyId: req.user.companyId }).sort('-createdAt');
  success(res, incidents);
});

router.post('/', requireRole('admin','manager','super_admin'), async (req, res) => {
  const incident = await Incident.create({ ...req.body, companyId: req.user.companyId, detectedBy: 'manual' });
  success(res, incident, 'Incident created', 201);
});

router.patch('/:id', requireRole('admin','manager','super_admin'), async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(req.params.id, { $push: req.body.timelineUpdate ? { timeline: req.body.timelineUpdate } : {}, ...req.body }, { new: true });
  success(res, incident);
});

router.delete('/:id', requireRole('admin','super_admin'), async (req, res) => {
  await Incident.findByIdAndDelete(req.params.id);
  success(res, {}, 'Deleted');
});

// Heatmap: complaint counts by category for the last 24h
router.get('/heatmap', requireRole('admin','manager','super_admin'), async (req, res) => {
  const since = new Date(Date.now() - 24 * 3_600_000);
  const data = await Ticket.aggregate([
    { $match: { companyId: req.user.companyId, createdAt: { $gte: since } } },
    { $group: { _id: { category: '$category', hour: { $hour: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.hour': 1 } }
  ]);
  success(res, data);
});

module.exports = router;
