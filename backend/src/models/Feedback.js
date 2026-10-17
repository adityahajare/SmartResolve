const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const FeedbackSchema = new mongoose.Schema({
  ticketId:   { type: ObjectId, ref: 'Ticket', required: true },
  customerId: { type: ObjectId, ref: 'User', required: true },
  rating:     { type: Number, min: 1, max: 5, required: true },
  comment:    { type: String, default: '' },
  isResolved: { type: Boolean, required: true },
  reopenReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
