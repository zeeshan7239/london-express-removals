import nodemailer from 'nodemailer';
import {
  quoteRequestCompanyTemplate,
  quoteConfirmationCustomerTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  quoteAcceptedTemplate,
  quoteRejectedTemplate,
} from '@/lib/templates/emailTemplates.js';

// Cache transporter across hot reloads in dev
let transporter = globalThis.mailTransporter;

const getTransporter = () => {
  if (transporter) return transporter;
  const port = Number(process.env.EMAIL_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 10_000,
    tls: { minVersion: 'TLSv1.2' },
  });

  globalThis.mailTransporter = transporter;
  return transporter;
};
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'London Express Removals'}" <${process.env.EMAIL_USER}>`,
      to, subject, html, text: text || subject,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ Email error:', err.message);
    return null;
  }
};

export const sendQuoteEmails = async (quote) => {
  await Promise.all([
    sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🚚 ${quote.kind === 'booking' ? 'New Booking' : 'New Quote Request'} — ${quote.customer.name}`,
      html: quoteRequestCompanyTemplate(quote),
    }),
    sendEmail({
      to: quote.customer.email,
      subject: 'We received your request — London Express Removals',
      html: quoteConfirmationCustomerTemplate(quote),
    }),
  ]);
};

export const sendWelcomeEmail = async (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to London Express Removals',
    html: welcomeEmailTemplate(user),
  });

export const sendPasswordResetEmail = async (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Reset your password — London Express Removals',
    html: passwordResetTemplate(user, resetUrl),
  });

export const sendQuoteAcceptedEmail = async (quote, message, price) =>
  sendEmail({
    to: quote.customer.email,
    subject: '✅ Your move is confirmed — London Express Removals',
    html: quoteAcceptedTemplate(quote, message, price),
  });

export const sendQuoteRejectedEmail = async (quote, message) =>
  sendEmail({
    to: quote.customer.email,
    subject: 'About your quote request — London Express Removals',
    html: quoteRejectedTemplate(quote, message),
  });
