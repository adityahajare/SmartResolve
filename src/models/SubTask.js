const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const SubTaskSchema = new mongoose.Schema({
  parentTicketId: { type: ObjectId, ref: 'Ticket', required: true },
  subTaskId:      { type: String },           // TKT-FIN-0099-A
  issue:          { type: String, required: true },
  category:       { type: String },
  departmentId:   { type: ObjectId, ref: 'Department' },
  assignedTo:     { type: ObjectId, ref: 'User', default: null },
  agentMatchScore: Number,
  status: { type: String, enum: ['pending','in_progress','resolved'], default: 'pending' },
  slaDeadline:    { type: Date },
  resolvedAt:     { type: Date },
  resolutionNote: { type: String, default: '' }
}, { timestamps: true });

SubTaskSchema.pre('save', function (next) {
  if (!this.subTaskId) {
    this.subTaskId = `SUB-${Date.now()}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('SubTask', SubTaskSchema);
