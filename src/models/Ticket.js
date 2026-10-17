const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
  senderId:   { type: ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['customer','agent','manager','admin','system'] },
  content:    { type: String, required: true },
  attachments: [{ url: String, name: String, type: String }],
  isInternal:  { type: Boolean, default: false }, // internal notes, hidden from customer
  sentiment:   { label: String, score: Number },
  sentAt:      { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  // ── Identity ──────────────────────────────────────────────────────
  ticketId:   { type: String, unique: true },          // TKT-20261017-0042
  customerId: { type: ObjectId, ref: 'User', required: true },
  companyId:  { type: ObjectId, ref: 'Company', required: true },

  // ── Content ───────────────────────────────────────────────────────
  title:       { type: String, default: '' },
  description: { type: String, required: true },
  category:    { type: String, default: 'Other Issues' },
  subcategory: { type: String, default: '' },
  attachments: [{ url: String, type: String, name: String, size: Number, ocrText: String }],
  voiceUrl:        { type: String, default: '' },
  voiceTranscript: { type: String, default: '' },
  inputChannel: {
    type: String,
    enum: ['form','chatbot','voice','screenshot','email','whatsapp','widget','call'],
    default: 'form'
  },
  referenceId: { type: String, default: '' }, // order ID / TXN ID
  tags: [String],

  // ── Status ────────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['draft','pending','assigned','in_progress','waiting_customer',
           'waiting_internal','resolved','closed','reopened'],
    default: 'pending'
  },
  statusHistory: [{
    status:    String,
    changedBy: { type: ObjectId, ref: 'User' },
    reason:    String,
    changedAt: { type: Date, default: Date.now }
  }],

  // ── Priority & Scheduler ──────────────────────────────────────────
  priority:       { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  priorityScore:  { type: Number, default: 0, min: 0, max: 100 },
  shadowScore:    { type: Number, default: 0 },  // aging boost
  finalScore:     { type: Number, default: 0 },  // priorityScore + shadowScore
  queueLevel:     { type: Number, enum: [1,2,3,4], default: 3 }, // 1=critical, 4=low
  lastScoreUpdate:{ type: Date },

  // ── AI Analysis ───────────────────────────────────────────────────
  aiAnalysis: {
    sentiment: {
      label:   { type: String, enum: ['furious','angry','frustrated','neutral','satisfied'] },
      score:   Number,  // -1 to +1
      history: [{
        score: Number, label: String,
        messageIndex: Number, analyzedAt: Date
      }]
    },
    urgency:  { type: String, enum: ['low','medium','high','critical'] },
    category: { predicted: String, subcategory: String, confidence: Number },
    signals: {
      monetaryAmount:       Number,
      hasThreatLanguage:    Boolean,
      hasDeadlinePressure:  Boolean,
      entities:             mongoose.Schema.Types.Mixed,
    },
    dnaFingerprint: String,
    duplicateOf:    { type: ObjectId, ref: 'Ticket', default: null },
    kbSuggestions:  [{ articleId: ObjectId, title: String, url: String, confidence: Number }],
    frustractionForecast: { probability: Number, predictedAction: String, forecastedAt: Date },
    analyzedAt: Date
  },

  // ── Routing ───────────────────────────────────────────────────────
  assignedTo:    { type: ObjectId, ref: 'User', default: null },
  departmentId:  { type: ObjectId, ref: 'Department', default: null },
  agentMatchScore: Number,
  routingReason: String,

  // ── Complex Complaint Pipeline ────────────────────────────────────
  isComplex: { type: Boolean, default: false },
  subTasks:  [{ type: ObjectId, ref: 'SubTask' }],

  // ── Escalation ────────────────────────────────────────────────────
  escalationLevel: { type: Number, default: 0, min: 0, max: 3 },
  escalationHistory: [{
    fromId:      { type: ObjectId, ref: 'User' },
    toId:        { type: ObjectId, ref: 'User' },
    reason:      String,
    triggerType: { type: String, enum: ['manual','sla_breach','sentiment','wait_time','repeat'] },
    escalatedAt: { type: Date, default: Date.now }
  }],

  // ── SLA ───────────────────────────────────────────────────────────
  slaDeadline:     { type: Date },
  slaBreached:     { type: Boolean, default: false },
  firstResponseAt: { type: Date },
  resolvedAt:      { type: Date },
  responseTime:    Number,   // minutes to first response
  resolutionTime:  Number,   // minutes to resolve

  // ── Incident ──────────────────────────────────────────────────────
  incidentId:  { type: ObjectId, ref: 'Incident', default: null },
  isRepeat:    { type: Boolean, default: false },
  repeatCount: { type: Number, default: 0 },

  // ── Messages Thread ───────────────────────────────────────────────
  messages: [MessageSchema],

  // ── Resolution ────────────────────────────────────────────────────
  resolutionSummary:         { type: String, default: '' },
  resolutionConfidenceScore: Number,
  feedback: { type: ObjectId, ref: 'Feedback', default: null },

  source: { type: String, default: '' },
}, { timestamps: true });

// ── Pre-save: auto-generate ticketId & compute finalScore ──────────
TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const Ticket = mongoose.model('Ticket');
    const count  = (await Ticket.countDocuments()) + 1;
    this.ticketId = `TKT-${date}-${String(count).padStart(4, '0')}`;
  }
  this.finalScore = (this.priorityScore || 0) + (this.shadowScore || 0);
  next();
});

// ── Index for fast queue sorting ──────────────────────────────────
TicketSchema.index({ companyId: 1, queueLevel: 1, finalScore: -1, createdAt: 1 });
TicketSchema.index({ customerId: 1, status: 1 });

module.exports = mongoose.model('Ticket', TicketSchema);
