const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const send = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: `SmartResolve <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = {
  sendWelcomeEmail: (user) => send(user.email, 'Welcome to SmartResolve!',
    `<h2>Hi ${user.name}!</h2><p>Your account has been created successfully.</p>`),

  sendTicketConfirmation: (ticket, customer) => send(customer.email,
    `Complaint Received: ${ticket.ticketId}`,
    `<h2>We received your complaint</h2><p>Ticket ID: <strong>${ticket.ticketId}</strong></p>
     <p>Priority: ${ticket.priority}</p><p>We'll respond within your SLA window.</p>`),

  sendStatusUpdate: (ticket, customer, newStatus) => send(customer.email,
    `Update on ${ticket.ticketId}`,
    `<h2>Complaint Status Update</h2><p>Your complaint <strong>${ticket.ticketId}</strong> is now: <strong>${newStatus}</strong></p>`),

  sendPasswordReset: (user, otp) => send(user.email, 'Password Reset OTP - SmartResolve',
    `<h2>Password Reset</h2><p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`)
};
