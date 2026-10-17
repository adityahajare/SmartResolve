const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DepartmentSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  companyId:     { type: ObjectId, ref: 'Company', required: true },
  headManagerId: { type: ObjectId, ref: 'User', default: null },
  agents:        [{ type: ObjectId, ref: 'User' }],
  categories:    [{ type: String }],  // which complaint categories this dept handles
  slaHours: {
    critical: { type: Number, default: 2  },
    high:     { type: Number, default: 4  },
    medium:   { type: Number, default: 24 },
    low:      { type: Number, default: 48 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
