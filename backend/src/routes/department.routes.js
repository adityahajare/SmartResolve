const express = require('express');
const router  = express.Router();
const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const Dept = require('../models/Department');
const { success, error } = require('../utils/apiResponse');

router.use(protect);

router.get('/',    async (req, res) => { const d = await Dept.find({ companyId: req.user.companyId }); success(res, d); });
router.post('/',   requireRole('admin','super_admin'), async (req, res) => { const d = await Dept.create({ ...req.body, companyId: req.user.companyId }); success(res, d, 'Department created', 201); });
router.patch('/:id', requireRole('admin','super_admin'), async (req, res) => { const d = await Dept.findByIdAndUpdate(req.params.id, req.body, { new: true }); success(res, d); });
router.delete('/:id', requireRole('admin','super_admin'), async (req, res) => { await Dept.findByIdAndDelete(req.params.id); success(res, {}, 'Deleted'); });
router.post('/:id/assign-agent', requireRole('admin','manager','super_admin'), async (req, res) => {
  const d = await Dept.findByIdAndUpdate(req.params.id, { $addToSet: { agents: req.body.agentId } }, { new: true });
  success(res, d);
});
router.get('/:id/agents', async (req, res) => {
  const d = await Dept.findById(req.params.id).populate('agents', 'name email agentProfile');
  success(res, d?.agents || []);
});

module.exports = router;
