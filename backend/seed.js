require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User       = require('./src/models/User');
const Company    = require('./src/models/Company');
const Department = require('./src/models/Department');
const Ticket     = require('./src/models/Ticket');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // 1. Create Default Company
    let company = await Company.findOne({ name: 'SmartResolve Inc' });
    if (!company) {
      company = await Company.create({
        name: 'SmartResolve Inc',
        email: 'ops@smartresolve.ai',
        plan: 'enterprise'
      });
      console.log('Created Company:', company.name);
    }

    // 2. Create Departments
    const deptNames = ['Payment & Billing', 'Logistics & Orders', 'Tech Support', 'Compliance'];
    const depts = {};
    for (const d of deptNames) {
      let dept = await Department.findOne({ name: d });
      if (!dept) {
        dept = await Department.create({ name: d, companyId: company._id });
      }
      depts[d] = dept._id;
    }

    // 3. Create Users
    const passwordHash = await bcrypt.hash('Admin@1234', 10);
    const customerHash = await bcrypt.hash('Customer@1234', 10);

    const usersToCreate = [
      {
        name: 'Aditya (Admin Ops)',
        email: 'admin@smartresolve.ai',
        password: passwordHash,
        role: 'admin',
        companyId: company._id,
        accountType: 'premium'
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram.agent@smartresolve.ai',
        password: passwordHash,
        role: 'agent',
        companyId: company._id,
        departmentId: depts['Payment & Billing'],
        agentProfile: { skillLevel: 'senior', expertiseCategories: ['Payment', 'Fraud'], performanceScore: 95, isAvailable: true }
      },
      {
        name: 'Rahul Sharma',
        email: 'customer@smartresolve.ai',
        password: customerHash,
        role: 'customer',
        accountType: 'standard'
      }
    ];

    const createdUsers = {};
    for (const u of usersToCreate) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
        console.log(`Created user: ${u.email} (${u.role})`);
      }
      createdUsers[u.role] = existing;
    }

    // 4. Seed Live Real-World Tickets
    const existingTickets = await Ticket.countDocuments();
    if (existingTickets === 0) {
      const ticketsToSeed = [
        {
          ticketId: 'SR-0083',
          customerId: createdUsers['customer']._id,
          companyId: company._id,
          title: 'Cannot connect to payment gateway during checkout',
          description: 'UPI transaction deducted ₹4,500 from my HDFC bank account, but the checkout portal timed out without generating an order ID. Need immediate resolution as per RBI T+1 norms.',
          category: 'Payment',
          subcategory: 'UPI Failed',
          priority: 'critical',
          priorityScore: 88,
          shadowScore: 10,
          finalScore: 98,
          queueLevel: 1,
          status: 'in_progress',
          slaDeadline: new Date(Date.now() + 3600000), // 1 hour left
          aiAnalysis: {
            sentiment: { label: 'furious', score: -0.85 },
            urgency: 'critical',
            dnaFingerprint: 'DNA-PAY-UPI-EVN-MID-FRU-001',
            signals: { monetaryAmount: 4500, hasDeadlinePressure: true, hasThreatLanguage: true }
          },
          messages: [
            { senderId: createdUsers['customer']._id, senderRole: 'customer', content: 'Debited from my bank! Please reverse immediately.', sentAt: new Date(Date.now() - 3600000) },
            { senderId: createdUsers['agent']._id, senderRole: 'agent', content: 'We have initiated gateway verification with the banking partner.', sentAt: new Date(Date.now() - 1800000) }
          ]
        },
        {
          ticketId: 'SR-0082',
          customerId: createdUsers['customer']._id,
          companyId: company._id,
          title: 'Application authentication error on OTP login',
          description: 'Login requests failing with 504 Gateway error across mobile devices.',
          category: 'Technical',
          subcategory: 'Auth Bug',
          priority: 'high',
          priorityScore: 78,
          shadowScore: 6,
          finalScore: 84,
          queueLevel: 2,
          status: 'pending',
          slaDeadline: new Date(Date.now() + 7200000),
          aiAnalysis: {
            sentiment: { label: 'angry', score: -0.6 },
            urgency: 'high',
            dnaFingerprint: 'DNA-TECH-AUTH-002'
          }
        },
        {
          ticketId: 'SR-0091',
          customerId: createdUsers['customer']._id,
          companyId: company._id,
          title: 'Delayed courier shipment tracking stalled at Delhi Hub',
          description: 'Package has been stalled at the central transit hub for 72 hours without scan.',
          category: 'Delivery',
          subcategory: 'Delayed Shipping',
          priority: 'medium',
          priorityScore: 58,
          shadowScore: 15,
          finalScore: 73,
          queueLevel: 3,
          status: 'assigned',
          slaDeadline: new Date(Date.now() + 43200000),
          aiAnalysis: {
            sentiment: { label: 'frustrated', score: -0.4 },
            urgency: 'medium',
            dnaFingerprint: 'DNA-DEL-HUB-003'
          }
        }
      ];

      for (const t of ticketsToSeed) {
        await Ticket.create(t);
      }
      console.log('Seeded live sample tickets into Atlas database!');
    }

    console.log('Seeding complete! Atlas DB is now populated with real accounts and data.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedData();
