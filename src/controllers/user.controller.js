const User   = require('../models/User');
const Ticket = require('../models/Ticket');
const { success, error } = require('../utils/apiResponse');

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('companyId','name').populate('departmentId','name');
    if (!user) return error(res, 'User not found', 404);
    success(res, user);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowed = ['name','phone','avatar','agentProfile','accountType'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return error(res, 'User not found', 404);
    success(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    success(res, {}, 'User deactivated');
  } catch (err) { next(err); }
};

exports.getAvailableAgents = async (req, res, next) => {
  try {
    const agents = await User.find({
      companyId: req.user.companyId,
      role: { $in: ['agent','manager'] },
      'agentProfile.isAvailable': true,
      'agentProfile.activeTicketCount': { $lt: 15 },
      isActive: true
    }).select('name email agentProfile departmentId');
    success(res, agents);
  } catch (err) { next(err); }
};

exports.getAgentPerformance = async (req, res, next) => {
  try {
    const agents = await User.find({
      companyId: req.user.companyId,
      role: { $in: ['agent','manager'] }
    }).select('name email agentProfile departmentId');

    const performance = await Promise.all(agents.map(async (agent) => {
      const resolved = await Ticket.countDocuments({ assignedTo: agent._id, status: { $in: ['resolved','closed'] } });
      const total    = await Ticket.countDocuments({ assignedTo: agent._id });
      const breached = await Ticket.countDocuments({ assignedTo: agent._id, slaBreached: true });
      const reopened = await Ticket.countDocuments({ assignedTo: agent._id, status: 'reopened' });
      const avgResolutionData = await Ticket.aggregate([
        { $match: { assignedTo: agent._id, resolutionTime: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }
      ]);
      return {
        agent: { _id: agent._id, name: agent.name, email: agent.email, agentProfile: agent.agentProfile },
        stats: {
          totalAssigned: total,
          resolved,
          resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
          slaBreaches: breached,
          slaCompliance: total ? Math.round(((total - breached) / total) * 100) : 100,
          reopenedCount: reopened,
          avgResolutionMins: Math.round(avgResolutionData[0]?.avg || 0),
          performanceScore: agent.agentProfile?.performanceScore || 50
        }
      };
    }));

    performance.sort((a, b) => b.stats.performanceScore - a.stats.performanceScore);
    success(res, performance);
  } catch (err) { next(err); }
};
