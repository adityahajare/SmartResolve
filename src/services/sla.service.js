// SLA hours per priority level
const SLA_HOURS = { critical: 2, high: 4, medium: 24, low: 48 };

const calculateSLADeadline = (priority, category) => {
  const hours = SLA_HOURS[priority] || 24;
  return new Date(Date.now() + hours * 3_600_000);
};

const checkSLAStatus = (ticket) => {
  if (!ticket.slaDeadline) return { breached: false, hoursRemaining: null };
  const now = new Date();
  const msRemaining = ticket.slaDeadline - now;
  const hoursRemaining = msRemaining / 3_600_000;
  return { breached: hoursRemaining < 0, hoursRemaining: Math.max(0, hoursRemaining) };
};

module.exports = { calculateSLADeadline, checkSLAStatus };
