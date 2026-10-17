const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, unique: true },
  logo:    { type: String, default: '' },
  phone:   { type: String, default: '' },
  address: { type: String, default: '' },
  website: { type: String, default: '' },
  plan:    { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  isActive: { type: Boolean, default: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  settings: {
    allowedCategories: [String],
    defaultSLAHours:   { type: Number, default: 24 },
    autoAssign:        { type: Boolean, default: true },
    kbAutoReply:       { type: Boolean, default: true },
    incidentThreshold: { type: Number, default: 10 }, // complaints to declare incident
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
