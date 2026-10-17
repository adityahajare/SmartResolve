const Notification = require('../models/Notification');

// io is set on the app; import here via a getter to avoid circular deps
let _io;
const getIO = () => _io;
const setIO = (io) => { _io = io; };

const createAndEmit = async ({ userId, companyId, ticketId, type, title, message }) => {
  const notif = await Notification.create({ userId, companyId, ticketId, type, title, message, channel: ['in-app'] });
  if (_io) _io.to(`user_${userId}`).emit('notification', notif);
  return notif;
};

const notificationService = {
  setIO,
  async ticketCreated(ticket) {
    await createAndEmit({
      userId: ticket.customerId, companyId: ticket.companyId, ticketId: ticket._id,
      type: 'ticket_created',
      title: 'Complaint Submitted',
      message: `Your complaint ${ticket.ticketId} has been received and is being processed.`
    });
  },
  async ticketUpdated(ticket, message = '') {
    await createAndEmit({
      userId: ticket.customerId, companyId: ticket.companyId, ticketId: ticket._id,
      type: 'ticket_updated', title: 'Complaint Updated',
      message: message || `Your complaint ${ticket.ticketId} status changed to ${ticket.status}.`
    });
  },
  async newMessage(ticket, senderId) {
    const targetId = senderId.toString() === ticket.customerId.toString()
      ? ticket.assignedTo : ticket.customerId;
    if (!targetId) return;
    await createAndEmit({
      userId: targetId, companyId: ticket.companyId, ticketId: ticket._id,
      type: 'new_message', title: 'New Reply',
      message: `New message on complaint ${ticket.ticketId}`
    });
  },
  async escalation(ticket, toUser, triggerType) {
    // Notify customer
    await createAndEmit({
      userId: ticket.customerId, companyId: ticket.companyId, ticketId: ticket._id,
      type: 'escalated', title: 'Complaint Escalated',
      message: `Your complaint ${ticket.ticketId} has been escalated to a senior specialist.`
    });
    // Notify new assignee
    await createAndEmit({
      userId: toUser._id, companyId: ticket.companyId, ticketId: ticket._id,
      type: 'escalated', title: 'Complaint Assigned to You (Escalated)',
      message: `Ticket ${ticket.ticketId} escalated to you. Reason: ${triggerType}`
    });
  },
  async shadowEscalation(ticket) {
    if (!ticket.companyId) return;
    if (_io) _io.to(`company_${ticket.companyId}`).emit('shadow_promoted', {
      ticketId: ticket.ticketId, newPriority: ticket.priority, finalScore: ticket.finalScore
    });
  },
  async incidentDeclared(incident) {
    if (_io) _io.to(`company_${incident.companyId}`).emit('incident_declared', incident);
  }
};

module.exports = notificationService;
