const User       = require('../models/User');
const Department = require('../models/Department');

class RoutingEngine {
  /**
   * Route a ticket to the best available agent
   * @returns { agentId, departmentId, matchScore, reason, kbMode }
   */
  async route(ticket, aiResult) {
    const { priorityLevel, category } = aiResult;

    // LOW priority + KB match → no human needed yet
    if (priorityLevel === 'low' && aiResult.kbSuggestions?.length > 0)
      return { agentId: null, departmentId: null, kbMode: true, matchScore: 0, reason: 'KB auto-reply' };

    // Find responsible department
    const department = await Department.findOne({
      companyId: ticket.companyId,
      categories: { $in: [category?.predicted || ticket.category] },
      isActive: true
    });

    if (!department)
      return { agentId: null, departmentId: null, kbMode: false, matchScore: 0, reason: 'No department found' };

    // Get available agents in dept
    const agents = await User.find({
      _id: { $in: department.agents },
      'agentProfile.isAvailable': true,
      'agentProfile.activeTicketCount': { $lt: 15 },
      isActive: true
    });

    if (!agents.length)
      return { agentId: null, departmentId: department._id, kbMode: false, matchScore: 0, reason: 'No agents available' };

    // Score each agent
    const scored = agents.map(agent => ({
      agent,
      score: this.calculateMatchScore(agent, category?.predicted || ticket.category, priorityLevel)
    })).sort((a, b) => b.score - a.score);

    // Critical → must assign senior agent if available
    const eligible = priorityLevel === 'critical'
      ? scored.filter(s => s.agent.agentProfile.skillLevel === 'senior')
      : scored;

    const best = (eligible[0] || scored[0]);

    // Increment agent workload
    await User.findByIdAndUpdate(best.agent._id, {
      $inc: { 'agentProfile.activeTicketCount': 1 }
    });

    return {
      agentId:      best.agent._id,
      departmentId: department._id,
      matchScore:   best.score,
      kbMode:       false,
      reason:       `Best match (${best.score}%) for ${category?.predicted} in ${department.name}`
    };
  }

  /**
   * Agent-Complaint Match Score:
   * expertise(40%) + availability(25%) + performance/CSAT(20%) + workload(15%)
   */
  calculateMatchScore(agent, category, priorityLevel) {
    const p = agent.agentProfile;
    const expertiseMatch  = p.expertiseCategories?.includes(category) ? 1.0 : 0.4;
    const availability    = Math.max(0, 1 - (p.activeTicketCount / 15));
    const performanceNorm = (p.performanceScore || 50) / 100;
    const workloadInverse = availability;

    const raw = (expertiseMatch  * 0.40) +
                (availability    * 0.25) +
                (performanceNorm * 0.20) +
                (workloadInverse * 0.15);

    return Math.round(raw * 100);
  }
}

module.exports = { RoutingEngine };
