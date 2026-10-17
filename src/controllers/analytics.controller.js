const Ticket   = require('../models/Ticket');
const Feedback = require('../models/Feedback');
const { success, error } = require('../utils/apiResponse');

exports.getCustomerAnalytics = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { days = 90 } = req.query;
    const since = new Date(Date.now() - days * 86_400_000);

    const [totals, byStatus, byCategory, trend, avgResolution] = await Promise.all([
      Ticket.countDocuments({ customerId, createdAt: { $gte: since } }),
      Ticket.aggregate([{ $match: { customerId: require('mongoose').Types.ObjectId(customerId), createdAt: { $gte: since } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { customerId: require('mongoose').Types.ObjectId(customerId), createdAt: { $gte: since } } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { customerId: require('mongoose').Types.ObjectId(customerId), createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Ticket.aggregate([{ $match: { customerId: require('mongoose').Types.ObjectId(customerId), resolutionTime: { $exists: true } } }, { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }])
    ]);

    success(res, { totals, byStatus, byCategory, trend, avgResolutionMins: Math.round(avgResolution[0]?.avg || 0) });
  } catch (err) { next(err); }
};

exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 86_400_000);
    const cid = require('mongoose').Types.ObjectId(companyId);

    const [kpis, byPriority, byCategory, byStatus, volumeTrend, slaData] = await Promise.all([
      Ticket.aggregate([{ $match: { companyId: cid, createdAt: { $gte: since } } }, { $group: { _id: null, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $in: ['$status',['resolved','closed']] }, 1, 0] } }, breached: { $sum: { $cond: ['$slaBreached', 1, 0] } }, avgResolution: { $avg: '$resolutionTime' } } }]),
      Ticket.aggregate([{ $match: { companyId: cid, createdAt: { $gte: since } } }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { companyId: cid, createdAt: { $gte: since } } }, { $group: { _id: '$category', count: { $sum: 1 }, avgResolution: { $avg: '$resolutionTime' } } }, { $sort: { count: -1 } }]),
      Ticket.aggregate([{ $match: { companyId: cid, createdAt: { $gte: since } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { companyId: cid, createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Ticket.aggregate([{ $match: { companyId: cid } }, { $group: { _id: null, total: { $sum: 1 }, breached: { $sum: { $cond: ['$slaBreached', 1, 0] } } } }])
    ]);

    const kpi = kpis[0] || {};
    success(res, {
      kpis: { ...kpi, slaCompliance: slaData[0] ? Math.round(((slaData[0].total - slaData[0].breached) / slaData[0].total) * 100) : 100 },
      byPriority, byCategory, byStatus, volumeTrend
    });
  } catch (err) { next(err); }
};

exports.getAgentLeaderboard = async (req, res, next) => {
  try {
    const { getAgentPerformance } = require('./user.controller');
    return getAgentPerformance(req, res, next);
  } catch (err) { next(err); }
};

exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const companyId = require('mongoose').Types.ObjectId(req.user.companyId);
    const data = await Ticket.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$category', total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $in: ['$status',['resolved','closed']] }, 1, 0] } }, breached: { $sum: { $cond: ['$slaBreached',1,0] } }, avgResolution: { $avg: '$resolutionTime' } } },
      { $sort: { total: -1 } }
    ]);
    success(res, data);
  } catch (err) { next(err); }
};

exports.getSLACompliance = async (req, res, next) => {
  try {
    const companyId = require('mongoose').Types.ObjectId(req.user.companyId);
    const data = await Ticket.aggregate([
      { $match: { companyId } },
      { $group: { _id: '$priority', total: { $sum: 1 }, breached: { $sum: { $cond: ['$slaBreached',1,0] } } } },
      { $project: { priority: '$_id', total: 1, breached: 1, compliance: { $subtract: [100, { $multiply: [{ $divide: ['$breached','$total'] }, 100] }] } } }
    ]);
    success(res, data);
  } catch (err) { next(err); }
};
