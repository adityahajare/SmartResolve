const mongoose = require('mongoose');
const Ticket   = require('../models/Ticket');
const Feedback = require('../models/Feedback');
const { success, error } = require('../utils/apiResponse');

const toObjectId = (id) => {
  if (!id) return null;
  return typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
};

exports.getCustomerAnalytics = async (req, res, next) => {
  try {
    const customerId = toObjectId(req.params.id);
    const { days = 90 } = req.query;
    const since = new Date(Date.now() - days * 86_400_000);

    const [totals, byStatus, byCategory, trend, avgResolution] = await Promise.all([
      Ticket.countDocuments({ customerId, createdAt: { $gte: since } }),
      Ticket.aggregate([{ $match: { customerId, createdAt: { $gte: since } } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { customerId, createdAt: { $gte: since } } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: { customerId, createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Ticket.aggregate([{ $match: { customerId, resolutionTime: { $exists: true } } }, { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }])
    ]);

    success(res, { totals, byStatus, byCategory, trend, avgResolutionMins: Math.round(avgResolution[0]?.avg || 0) });
  } catch (err) { next(err); }
};

exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const companyId = toObjectId(req.user.companyId);
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 86_400_000);
    const matchFilter = companyId ? { companyId, createdAt: { $gte: since } } : { createdAt: { $gte: since } };
    const allMatch = companyId ? { companyId } : {};

    const [totalTickets, activeTickets, criticalCount, kpis, byPriority, byCategory, volumeTrend, slaData] = await Promise.all([
      Ticket.countDocuments(allMatch),
      Ticket.countDocuments({ ...allMatch, status: { $nin: ['resolved', 'closed', 'draft'] } }),
      Ticket.countDocuments({ ...allMatch, queueLevel: 1, status: { $nin: ['resolved', 'closed'] } }),
      Ticket.aggregate([{ $match: matchFilter }, { $group: { _id: null, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $in: ['$status',['resolved','closed']] }, 1, 0] } }, breached: { $sum: { $cond: ['$slaBreached', 1, 0] } }, avgResolution: { $avg: '$resolutionTime' } } }]),
      Ticket.aggregate([{ $match: matchFilter }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: matchFilter }, { $group: { _id: '$category', count: { $sum: 1 }, avgResolution: { $avg: '$resolutionTime' } } }, { $sort: { count: -1 } }]),
      Ticket.aggregate([{ $match: matchFilter }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Ticket.aggregate([{ $match: allMatch }, { $group: { _id: null, total: { $sum: 1 }, breached: { $sum: { $cond: ['$slaBreached', 1, 0] } } } }])
    ]);

    const kpi = kpis[0] || {};
    const totalSla = slaData[0]?.total || 0;
    const breachedSla = slaData[0]?.breached || 0;
    const slaCompliance = totalSla > 0 ? Math.round(((totalSla - breachedSla) / totalSla) * 100) : 98;

    success(res, {
      totalTickets,
      activeTickets,
      criticalCount,
      slaCompliance,
      onlineAgents: 8,
      kpis: { ...kpi, slaCompliance },
      byPriority, byCategory, volumeTrend
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
    const companyId = toObjectId(req.user.companyId);
    const matchFilter = companyId ? { companyId } : {};
    const data = await Ticket.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$category', total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $in: ['$status',['resolved','closed']] }, 1, 0] } }, breached: { $sum: { $cond: ['$slaBreached',1,0] } }, avgResolution: { $avg: '$resolutionTime' } } },
      { $sort: { total: -1 } }
    ]);
    success(res, data);
  } catch (err) { next(err); }
};

exports.getSLACompliance = async (req, res, next) => {
  try {
    const companyId = toObjectId(req.user.companyId);
    const matchFilter = companyId ? { companyId } : {};
    const data = await Ticket.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$priority', total: { $sum: 1 }, breached: { $sum: { $cond: ['$slaBreached',1,0] } } } },
      { $project: { priority: '$_id', total: 1, breached: 1, compliance: { $subtract: [100, { $multiply: [{ $divide: ['$breached','$total'] }, 100] }] } } }
    ]);
    success(res, data);
  } catch (err) { next(err); }
};
