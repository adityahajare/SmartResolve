const express = require('express');
const router  = express.Router();
const { getUser, updateUser, deleteUser, getAvailableAgents, getAgentPerformance } = require('../controllers/user.controller');
const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(protect);
router.get('/agents/available',  requireRole('admin','manager','super_admin'), getAvailableAgents);
router.get('/performance',       requireRole('admin','manager','super_admin'), getAgentPerformance);
router.get('/:id',               getUser);
router.patch('/:id',             updateUser);
router.delete('/:id',            requireRole('admin','super_admin'), deleteUser);

module.exports = router;
