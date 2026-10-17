require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socket.handler');
const cron = require('node-cron');

const app = express();
const httpServer = createServer(app);

// ─── Socket.io Setup ────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});
app.set('io', io);
socketHandler(io);

// ─── Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }));

// ─── Routes ─────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/tickets',       require('./routes/ticket.routes'));
app.use('/api/users',         require('./routes/user.routes'));
app.use('/api/departments',   require('./routes/department.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/incidents',     require('./routes/incident.routes'));
app.use('/api/analytics',     require('./routes/analytics.routes'));
app.use('/api/kb',            require('./routes/kb.routes'));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'SmartResolve API' }));

// ─── Error Handler ───────────────────────────────────────────────────
app.use(require('./middleware/error.middleware'));

// ─── Cron Jobs ───────────────────────────────────────────────────────
const { PriorityScheduler } = require('./services/scheduler.service');
const { EscalationEngine }  = require('./services/escalation.service');
const scheduler  = new PriorityScheduler();
const escalation = new EscalationEngine();

cron.schedule('*/15 * * * *', () => scheduler.runShadowBoost());   // every 15 mins
cron.schedule('*/10 * * * *', () => escalation.runAutoEscalation()); // every 10 mins

// ─── Start ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`🚀 SmartResolve Server running on port ${PORT}`));
});
