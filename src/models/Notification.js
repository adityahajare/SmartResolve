const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const NotificationSchema = new mongoose.Schema({
  userId:    { type: ObjectId, ref: 'User', required: true },
  companyId: { type: ObjectId, ref: 'Company' },
  ticketId:  { type: ObjectId, ref: 'Ticket', default: null },
  type: {
    type: String,
    enum: ['ticket_created','ticket_updated','new_message','escalated',
           'resolved','incident','shadow_promoted','frustration_alert'],
    required: true
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  isRead:  { type: Boolean, default: false },
  channel: [{ type: String, enum: ['in-app','email','sms'] }],
}, { timestamps: true });

NotificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
