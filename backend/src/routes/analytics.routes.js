const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/analytics.controller');
const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(protect);

router.get('/customer/:id', ctrl.getCustomerAnalytics);
router.get('/admin',        requireRole('admin','super_admin','manager'), ctrl.getAdminAnalytics);
router.get('/agents',       requireRole('admin','super_admin','manager'), ctrl.getAgentLeaderboard);
router.get('/categories',   requireRole('admin','super_admin','manager'), ctrl.getCategoryAnalytics);
router.get('/sla',          requireRole('admin','super_admin','manager'), ctrl.getSLACompliance);

module.exports = router;
