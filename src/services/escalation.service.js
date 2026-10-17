const Ticket = require('../models/Ticket');
const User   = require('../models/User');
const notificationService = require('./notification.service');

const ESCALATION_CHAIN = ['agent', 'senior_agent', 'manager', 'admin'];

class EscalationEngine {
  getEscalationReason(triggerType, ticket) {
    const reasons = {
      sla_breach:  `SLA deadline breached for ticket ${ticket.ticketId}`,
      sentiment:   `Customer sentiment reached FURIOUS on ticket ${ticket.ticketId}`,
      wait_time:   `Ticket ${ticket.ticketId} has been waiting too long`,
      repeat:      `Same issue reported ${ticket.repeatCount} times`,
      manual:      'Manually escalated by agent'
    };
    return reasons[triggerType] || 'Escalated';
  }

  async findNextInChain(ticket, targetRole) {
    const query = {
      companyId: ticket.companyId,
      role: targetRole === 'senior_agent' ? 'agent' : targetRole,
      isActive: true
    };
    if (targetRole === 'senior_agent') query['agentProfile.skillLevel'] = 'senior';
    if (ticket.departmentId) query.departmentId = ticket.departmentId;
    return User.findOne(query);
  }

  async checkAndEscalate(ticket, triggerType) {
    if (ticket.escalationLevel >= 3) return;

    const nextLevel = ticket.escalationLevel + 1;
    const nextRole  = ESCALATION_CHAIN[nextLevel];
    const nextAssignee = await this.findNextInChain(ticket, nextRole);
    if (!nextAssignee) return;

    ticket.escalationHistory.push({
      fromId: ticket.assignedTo,
      toId:   nextAssignee._id,
      reason: this.getEscalationReason(triggerType, ticket),
      triggerType,
      escalatedAt: new Date()
    });

    ticket.escalationLevel = nextLevel;
    ticket.assignedTo      = nextAssignee._id;
    ticket.priority        = 'critical';
    ticket.priorityScore   = Math.min((ticket.priorityScore || 0) + 20, 100);
    ticket.queueLevel      = 1;

    await ticket.save();
    await notificationService.escalation(ticket, nextAssignee, triggerType);
  }

  /** Runs every 10 minutes — auto-escalates SLA breaching & furious tickets */
  async runAutoEscalation() {
    console.log('🔺 Running auto-escalation check...');
    const now = new Date();

    // SLA-imminent tickets (< 4 hours)
    const slaTickets = await Ticket.find({
      status: { $nin: ['resolved', 'closed'] },
      slaDeadline: { $lt: new Date(now.getTime() + 4 * 3_600_000) },
      slaBreached: false,
      escalationLevel: { $lt: 3 }
    });

    for (const ticket of slaTickets) {
      if (ticket.slaDeadline < now) ticket.slaBreached = true;
      await this.checkAndEscalate(ticket, 'sla_breach');
    }

    // Furious-sentiment tickets not yet escalated
    const furiousTickets = await Ticket.find({
      'aiAnalysis.sentiment.label': 'furious',
      status: { $nin: ['resolved', 'closed'] },
      escalationLevel: 0
    });

    for (const ticket of furiousTickets) {
      await this.checkAndEscalate(ticket, 'sentiment');
    }

    console.log(`✅ Escalation check: ${slaTickets.length + furiousTickets.length} processed`);
  }
}

module.exports = { EscalationEngine };
