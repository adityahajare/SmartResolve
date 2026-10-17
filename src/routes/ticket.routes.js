const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ticket.controller');
const { protect }      = require('../middleware/auth.middleware');
const { requireRole }  = require('../middleware/role.middleware');

router.use(protect);

router.post('/',                 ctrl.createTicket);
router.get('/',                  ctrl.getTickets);
router.get('/queue',             requireRole('agent','manager','admin','super_admin'), ctrl.getPriorityQueue);
router.get('/forecast',          requireRole('manager','admin','super_admin'), ctrl.getFrustrationForecast);
router.post('/analyze',          ctrl.analyzeTicket);
router.get('/:id',               ctrl.getTicketById);
router.patch('/:id/status',      ctrl.updateStatus);
router.post('/:id/messages',     ctrl.addMessage);
router.post('/:id/escalate',     ctrl.escalate);
router.post('/:id/assign',       requireRole('manager','admin','super_admin'), ctrl.assign);
router.post('/:id/reopen',       ctrl.reopen);

module.exports = router;
