const notificationService = require('../services/notification.service');

module.exports = (io) => {
  notificationService.setIO(io);

  io.on('connection', (socket) => {
    const { userId, companyId } = socket.handshake.auth;

    if (userId)    socket.join(`user_${userId}`);
    if (companyId) socket.join(`company_${companyId}`);

    console.log(`🔌 Socket connected: user=${userId}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: user=${userId}`);
    });
  });

  // Events emitted elsewhere in the app:
  // io.to(`user_${id}`).emit('notification', data)
  // io.to(`user_${id}`).emit('ticket_created', data)
  // io.to(`user_${id}`).emit('ticket_updated', data)
  // io.to(`user_${id}`).emit('new_message', data)
  // io.to(`user_${id}`).emit('ticket_escalated', data)
  // io.to(`company_${id}`).emit('new_ticket', data)
  // io.to(`company_${id}`).emit('incident_declared', data)
  // io.to(`company_${id}`).emit('shadow_promoted', data)
  // io.to(`company_${id}`).emit('frustration_alert', data)
};
