const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['customer', 'agent', 'manager', 'admin', 'super_admin'],
    default: 'customer'
  },
  companyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  avatar:  { type: String, default: '' },
  phone:   { type: String, default: '' },
  accountType: { type: String, enum: ['free', 'standard', 'premium'], default: 'standard' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },

  // Agent-specific profile
  agentProfile: {
    skillLevel: { type: String, enum: ['junior', 'mid', 'senior'], default: 'junior' },
    expertiseCategories: [{ type: String }],
    performanceScore: { type: Number, default: 50, min: 0, max: 100 },
    isAvailable: { type: Boolean, default: true },
    activeTicketCount: { type: Number, default: 0 }
  },

  // Auth
  refreshToken: { type: String, default: null },
  passwordResetOTP: { type: String, default: null },
  passwordResetExpiry: { type: Date, default: null },
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String, default: null },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetOTP;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
