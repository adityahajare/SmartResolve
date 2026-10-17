const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const AuditLogSchema = new mongoose.Schema({
  userId:    { type: ObjectId, ref: 'User' },
  action:    { type: String, required: true },
  entity:    { type: String, required: true },
  entityId:  { type: ObjectId },
  oldValue:  { type: mongoose.Schema.Types.Mixed },
  newValue:  { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
