const Ticket  = require('../models/Ticket');
const User    = require('../models/User');
const SubTask = require('../models/SubTask');
const aiService          = require('../services/ai.service');
const { RoutingEngine }  = require('../services/routing.service');
const { calculateSLADeadline } = require('../services/sla.service');
const notificationService      = require('../services/notification.service');
const emailService             = require('../services/email.service');
const { success, error }       = require('../utils/apiResponse');

const routing = new RoutingEngine();

// ─── Helper: score → priority level ──────────────────────────────────
const scoreToMeta = (score) => {
  if (score >= 90) return { priority: 'critical', queueLevel: 1 };
  if (score >= 65) return { priority: 'high',     queueLevel: 2 };
  if (score >= 35) return { priority: 'medium',   queueLevel: 3 };
  return                  { priority: 'low',      queueLevel: 4 };
};

// ─── CREATE TICKET (Full AI Pipeline) ────────────────────────────────
exports.createTicket = async (req, res, next) => {
  try {
    const {
      description, category, subcategory, attachments,
      voiceTranscript, referenceId, inputChannel, companyId
    } = req.body;

    const customer = req.user;

    // 1. Build ticket draft
    const ticketData = {
      customerId:  customer._id,
      companyId:   customer.companyId || companyId,
      description,
      category:    category || 'Other Issues',
      subcategory: subcategory || '',
      attachments: attachments || [],
      voiceTranscript: voiceTranscript || '',
      referenceId: referenceId || '',
      inputChannel: inputChannel || 'form',
      status: 'pending',
    };

    // 2. Check for repeat complaint
    const repeatCount = await Ticket.countDocuments({
      customerId: customer._id,
      category,
      status: { $nin: ['resolved', 'closed'] }
    });

    // 3. Call AI Service
    let aiResult = null;
    try {
      aiResult = await aiService.analyzeTicket({
        text: `${description} ${voiceTranscript || ''}`.trim(),
        metadata: {
          customerId:           customer._id.toString(),
          accountType:          customer.accountType || 'standard',
          waitTimeHours:        0,
          isRepeat:             repeatCount > 0,
          repeatCount,
          previousEscalations:  0,
        }
      });
    } catch (aiErr) {
      console.warn('AI service unavailable, using defaults:', aiErr.message);
      aiResult = {
        sentiment:      { label: 'neutral', score: 0 },
        urgency:        'medium',
        category:       { predicted: category, confidence: 1 },
        signals:        {},
        priorityScore:  35,
        priorityLevel:  'medium',
        dnaFingerprint: '',
        kbSuggestions:  [],
        isComplex:      false,
        subTaskBreakdown: []
      };
    }

    // 4. Apply AI results
    const { priority, queueLevel } = scoreToMeta(aiResult.priorityScore);

    ticketData.aiAnalysis = {
      sentiment:      aiResult.sentiment,
      urgency:        aiResult.urgency,
      category:       aiResult.category,
      signals:        aiResult.signals,
      dnaFingerprint: aiResult.dnaFingerprint,
      kbSuggestions:  aiResult.kbSuggestions || [],
      analyzedAt:     new Date()
    };
    ticketData.priority      = priority;
    ticketData.priorityScore = aiResult.priorityScore;
    ticketData.queueLevel    = queueLevel;
    ticketData.isRepeat      = repeatCount > 0;
    ticketData.repeatCount   = repeatCount;
    ticketData.slaDeadline   = calculateSLADeadline(priority, category);

    // 5. Route to agent (skip for low + KB match)
    const assignment = await routing.route({ ...ticketData, _id: 'temp' }, aiResult);
    if (assignment.agentId) {
      ticketData.assignedTo    = assignment.agentId;
      ticketData.departmentId  = assignment.departmentId;
      ticketData.agentMatchScore = assignment.matchScore;
      ticketData.routingReason = assignment.reason;
      ticketData.status        = 'assigned';
    }

    // 6. Save ticket
    const ticket = await Ticket.create(ticketData);

    // 7. Handle complex complaint — create sub-tasks
    if (aiResult.isComplex && aiResult.subTaskBreakdown?.length > 0) {
      ticket.isComplex = true;
      const subTasks = await Promise.all(
        aiResult.subTaskBreakdown.map((st, i) =>
          SubTask.create({
            parentTicketId: ticket._id,
            issue:    st.issue,
            category: st.category,
            subTaskId: `${ticket.ticketId}-${String.fromCharCode(65 + i)}`
          })
        )
      );
      ticket.subTasks = subTasks.map(s => s._id);
      await ticket.save();
    }

    // 8. Notifications + email
    await notificationService.ticketCreated(ticket);
    try { await emailService.sendTicketConfirmation(ticket, customer); } catch (_) {}

    // 9. Emit to company agents
    const io = req.app.get('io');
    if (io) io.to(`company_${ticket.companyId}`).emit('new_ticket', ticket);

    return success(res, {
      ticketId:      ticket.ticketId,
      priority:      ticket.priority,
      priorityScore: ticket.priorityScore,
      status:        ticket.status,
      slaDeadline:   ticket.slaDeadline,
      kbSuggestions: ticket.aiAnalysis.kbSuggestions,
      isDuplicate:   !!ticket.aiAnalysis.duplicateOf,
      isComplex:     ticket.isComplex,
    }, 'Complaint submitted successfully', 201);

  } catch (err) { next(err); }
};

// ─── GET TICKETS (role-filtered) ─────────────────────────────────────
exports.getTickets = async (req, res, next) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    const role   = req.user.role;

    if (role === 'customer')                         filter.customerId  = req.user._id;
    else if (role === 'agent')                       filter.assignedTo  = req.user._id;
    else if (['manager','admin'].includes(role))     filter.companyId   = req.user.companyId;

    if (status)   filter.status   = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip    = (page - 1) * limit;
    const tickets = await Ticket.find(filter)
      .sort({ queueLevel: 1, finalScore: -1, createdAt: -1 })
      .skip(skip).limit(Number(limit))
      .populate('customerId', 'name email accountType')
      .populate('assignedTo', 'name agentProfile')
      .lean();

    const total = await Ticket.countDocuments(filter);
    success(res, { tickets, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// ─── GET SINGLE TICKET ────────────────────────────────────────────────
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ $or: [{ _id: req.params.id }, { ticketId: req.params.id }] })
      .populate('customerId', 'name email phone accountType')
      .populate('assignedTo', 'name email agentProfile')
      .populate('departmentId', 'name')
      .populate('subTasks');
    if (!ticket) return error(res, 'Ticket not found', 404);
    success(res, ticket);
  } catch (err) { next(err); }
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return error(res, 'Ticket not found', 404);

    ticket.statusHistory.push({ status, changedBy: req.user._id, reason, changedAt: new Date() });
    ticket.status = status;
    if (status === 'resolved') { ticket.resolvedAt = new Date(); ticket.resolutionTime = Math.round((ticket.resolvedAt - ticket.createdAt) / 60000); }
    await ticket.save();

    await notificationService.ticketUpdated(ticket);
    const io = req.app.get('io');
    if (io) io.to(`user_${ticket.customerId}`).emit('ticket_updated', { ticketId: ticket.ticketId, status });

    success(res, ticket, 'Status updated');
  } catch (err) { next(err); }
};

// ─── ADD MESSAGE ──────────────────────────────────────────────────────
exports.addMessage = async (req, res, next) => {
  try {
    const { content, isInternal, attachments } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return error(res, 'Ticket not found', 404);

    // Real-time sentiment analysis on new message
    let sentiment = { label: 'neutral', score: 0 };
    try {
      sentiment = await aiService.getSentiment(content);
      // Track emotion escalation
      ticket.aiAnalysis.sentiment.history = ticket.aiAnalysis.sentiment.history || [];
      ticket.aiAnalysis.sentiment.history.push({ ...sentiment, messageIndex: ticket.messages.length, analyzedAt: new Date() });
      // Update current sentiment if worsened
      if (sentiment.score < (ticket.aiAnalysis.sentiment.score || 0)) {
        ticket.aiAnalysis.sentiment.label = sentiment.label;
        ticket.aiAnalysis.sentiment.score = sentiment.score;
      }
    } catch (_) {}

    ticket.messages.push({ senderId: req.user._id, senderRole: req.user.role, content, isInternal: isInternal || false, attachments: attachments || [], sentiment, sentAt: new Date() });

    if (!ticket.firstResponseAt && req.user.role !== 'customer') {
      ticket.firstResponseAt = new Date();
      ticket.responseTime = Math.round((ticket.firstResponseAt - ticket.createdAt) / 60000);
    }

    await ticket.save();
    await notificationService.newMessage(ticket, req.user._id);
    const io = req.app.get('io');
    if (io) { const msg = ticket.messages[ticket.messages.length - 1]; io.to(`user_${ticket.customerId}`).emit('new_message', { ticketId: ticket.ticketId, message: msg }); }

    success(res, ticket.messages[ticket.messages.length - 1], 'Message sent');
  } catch (err) { next(err); }
};

// ─── ESCALATE ─────────────────────────────────────────────────────────
exports.escalate = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return error(res, 'Ticket not found', 404);
    const { EscalationEngine } = require('../services/escalation.service');
    const engine = new EscalationEngine();
    await engine.checkAndEscalate(ticket, 'manual');
    success(res, ticket, 'Ticket escalated');
  } catch (err) { next(err); }
};

// ─── ASSIGN ───────────────────────────────────────────────────────────
exports.assign = async (req, res, next) => {
  try {
    const { agentId, departmentId } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignedTo: agentId, departmentId, status: 'assigned' }, { new: true });
    if (!ticket) return error(res, 'Ticket not found', 404);
    success(res, ticket, 'Ticket assigned');
  } catch (err) { next(err); }
};

// ─── REOPEN ───────────────────────────────────────────────────────────
exports.reopen = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return error(res, 'Ticket not found', 404);
    ticket.status = 'reopened';
    ticket.statusHistory.push({ status: 'reopened', changedBy: req.user._id, reason });
    ticket.resolvedAt = null;
    await ticket.save();
    success(res, ticket, 'Ticket reopened');
  } catch (err) { next(err); }
};

// ─── GET PRIORITY QUEUE ───────────────────────────────────────────────
exports.getPriorityQueue = async (req, res, next) => {
  try {
    const { PriorityScheduler } = require('../services/scheduler.service');
    const scheduler = new PriorityScheduler();
    const queue = await scheduler.getPriorityQueue(req.user.companyId, req.query.agentId || null);
    success(res, queue);
  } catch (err) { next(err); }
};

// ─── FRUSTRATION FORECAST ─────────────────────────────────────────────
exports.getFrustrationForecast = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({
      companyId: req.user.companyId,
      status: { $nin: ['resolved','closed','draft'] }
    }).populate('customerId', 'name email');

    const forecasts = await Promise.all(tickets.map(async (t) => {
      const hoursLast = t.messages.length
        ? (Date.now() - new Date(t.messages[t.messages.length - 1].sentAt)) / 3_600_000
        : (Date.now() - new Date(t.createdAt)) / 3_600_000;
      try {
        const f = await aiService.getFrustrationForecast({
          hoursSinceLastResponse: hoursLast,
          sentimentTrend: t.aiAnalysis?.sentiment?.score || 0,
          previousEscalations: t.escalationLevel,
          slaHoursRemaining: t.slaDeadline ? (new Date(t.slaDeadline) - Date.now()) / 3_600_000 : 99,
          followUpCount: t.messages.filter(m => m.senderRole === 'customer').length,
          isRepeatComplaint: t.isRepeat ? 1 : 0,
          accountTypePremium: t.customerId?.accountType === 'premium' ? 1 : 0,
          ticketAgeHours: (Date.now() - new Date(t.createdAt)) / 3_600_000
        });
        return { ticket: { _id: t._id, ticketId: t.ticketId, customer: t.customerId }, ...f };
      } catch (_) { return null; }
    }));

    const valid = forecasts.filter(Boolean).sort((a, b) => b.frustrationProbability - a.frustrationProbability);
    success(res, valid);
  } catch (err) { next(err); }
};

// ─── ANALYZE (preview before submit) ─────────────────────────────────
exports.analyzeTicket = async (req, res, next) => {
  try {
    const { text, metadata } = req.body;
    const result = await aiService.analyzeTicket({ text, metadata: { ...metadata, customerId: req.user._id.toString() } });
    success(res, result);
  } catch (err) { next(err); }
};
