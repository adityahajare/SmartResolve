const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const IncidentSchema = new mongoose.Schema({
  incidentId:       { type: String, unique: true },
  companyId:        { type: ObjectId, ref: 'Company', required: true },
  title:            { type: String, required: true },
  description:      { type: String, default: '' },
  affectedCategory: { type: String },
  severity:         { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  status:           { type: String, enum: ['suspected','confirmed','fixing','resolved'], default: 'suspected' },
  detectedBy:       { type: String, enum: ['ai_cluster','manual'], default: 'ai_cluster' },
  linkedTickets:    [{ type: ObjectId, ref: 'Ticket' }],
  affectedCustomers:[{ type: ObjectId, ref: 'User' }],
  timeline: [{
    update:    String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: ObjectId, ref: 'User' }
  }],
  estimatedResolution: Date,
  resolvedAt:          Date,
  dnaPattern:          String,   // DNA fingerprint pattern that triggered this
  clusterSize:         { type: Number, default: 0 },
}, { timestamps: true });

IncidentSchema.pre('save', function (next) {
  if (!this.incidentId) {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
    this.incidentId = `INC-${date}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Incident', IncidentSchema);
