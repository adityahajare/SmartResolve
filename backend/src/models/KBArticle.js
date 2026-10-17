const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const KBArticleSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  category:   { type: String, required: true },
  subcategory:{ type: String, default: '' },
  content:    { type: String, required: true },
  tags:       [String],
  embedding:  [Number],            // sentence-transformer vector
  helpfulCount:    { type: Number, default: 0 },
  notHelpfulCount: { type: Number, default: 0 },
  companyId:  { type: ObjectId, ref: 'Company' },
  createdBy:  { type: ObjectId, ref: 'User' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('KBArticle', KBArticleSchema);
