const express   = require('express');
const router    = express.Router();
const KBArticle = require('../models/KBArticle');
const { protect }     = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { success }     = require('../utils/apiResponse');
const aiService       = require('../services/ai.service');

router.use(protect);

router.get('/', async (req, res) => {
  const articles = await KBArticle.find({ companyId: req.user.companyId, isActive: true });
  success(res, articles);
});
router.post('/', requireRole('admin','manager','super_admin'), async (req, res) => {
  const article = await KBArticle.create({ ...req.body, companyId: req.user.companyId, createdBy: req.user._id });
  success(res, article, 'Article created', 201);
});
router.patch('/:id', requireRole('admin','manager','super_admin'), async (req, res) => {
  const article = await KBArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  success(res, article);
});
router.delete('/:id', requireRole('admin','super_admin'), async (req, res) => {
  await KBArticle.findByIdAndDelete(req.params.id);
  success(res, {}, 'Deleted');
});
router.post('/suggest', async (req, res) => {
  const { text, category } = req.body;
  const suggestions = await aiService.getKBSuggestions(text, category);
  success(res, suggestions);
});

module.exports = router;
