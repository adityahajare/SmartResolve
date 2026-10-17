const Ticket = require('../models/Ticket');
const User   = require('../models/User');
const notificationService = require('./notification.service');

class PriorityScheduler {
  scoreToLevel(score) {
    if (score >= 90) return { priority: 'critical', queueLevel: 1 };
    if (score >= 65) return { priority: 'high',     queueLevel: 2 };
    if (score >= 35) return { priority: 'medium',   queueLevel: 3 };
    return                  { priority: 'low',      queueLevel: 4 };
  }

  /** Runs every 15 minutes — boosts shadow score for all waiting tickets */
  async runShadowBoost() {
    console.log('⏱️  Running shadow boost...');
    const now     = new Date();
    const tickets = await Ticket.find({ status: { $nin: ['resolved', 'closed', 'draft'] } });

    for (const ticket of tickets) {
      const hoursWaiting = (now - ticket.createdAt) / 3_600_000;
      let boost = 0;

      if      (hoursWaiting > 120) boost = 50;
      else if (hoursWaiting > 72)  boost = 30;
      else if (hoursWaiting > 48)  boost = 20;
      else if (hoursWaiting > 24)  boost = 15;
      else if (hoursWaiting > 12)  boost = 5;

      if (boost === ticket.shadowScore) continue;

      const oldLevel  = ticket.priority;
      ticket.shadowScore    = boost;
      ticket.finalScore     = ticket.priorityScore + boost;
      ticket.lastScoreUpdate= now;

      const { priority, queueLevel } = this.scoreToLevel(ticket.finalScore);
      ticket.priority   = priority;
      ticket.queueLevel = queueLevel;

      await ticket.save();

      // Alert if ticket crossed into high/critical from lower level
      if (oldLevel !== priority && ['high','critical'].includes(priority)) {
        await notificationService.shadowEscalation(ticket);
      }
    }
    console.log(`✅ Shadow boost complete for ${tickets.length} tickets`);
  }

  /** Return sorted priority queue for a company */
  async getPriorityQueue(companyId, agentId = null) {
    const filter = {
      companyId,
      status: { $nin: ['resolved', 'closed', 'draft'] }
    };
    if (agentId) filter.assignedTo = agentId;

    return Ticket.find(filter)
      .sort({ queueLevel: 1, finalScore: -1, createdAt: 1 })
      .populate('customerId', 'name accountType email')
      .populate('assignedTo',  'name agentProfile')
      .populate('departmentId','name')
      .lean();
  }

  /** PREEMPTION: Critical ticket pauses current medium/low ticket */
  async preempt(criticalTicket, agentId) {
    const current = await Ticket.findOne({
      assignedTo: agentId,
      status: 'in_progress',
      priority: { $in: ['low', 'medium'] }
    });

    if (current) {
      current.status      = 'assigned';
      current.shadowScore = (current.shadowScore || 0) + 10; // compensate wait
      await current.save();
    }

    criticalTicket.assignedTo = agentId;
    criticalTicket.status     = 'in_progress';
    await criticalTicket.save();
  }
}

module.exports = { PriorityScheduler };
