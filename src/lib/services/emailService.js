import { Resend } from 'resend';
import {
  quoteRequestCompanyTemplate,
  quoteConfirmationCustomerTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  quoteAcceptedTemplate,
  quoteRejectedTemplate,
} from '@/lib/templates/emailTemplates.js';

/**
 * Resend transactional email service.
 *
 * Replaces the previous nodemailer + Hostinger SMTP setup which timed out
 * unreliably on Vercel serverless. Resend is built for this use case:
 *   - Single HTTPS API call — no SMTP handshake
 *   - Works instantly on cold starts
 *   - Automatic retry + delivery tracking in the dashboard
 *
 * Function signatures are unchanged from the SMTP version, so the rest of the
 * codebase (otpService, register route, quotes route) needs no edits.
 */

// Lazy-instantiate the client — supports hot reload in dev
let resend = globalThis.resendClient;

const getResend = () => {
  if (resend) return resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set — email cannot be sent');
  }
  resend = new Resend(apiKey);
  globalThis.resendClient = resend;
  return resend;
};

/**
 * From-address builder.
 * Uses EMAIL_FROM_NAME + EMAIL_USER so existing env vars still work.
 * Example: "London Express Removals <hello@londonexpressremovals.co.uk>"
 */
const buildFrom = () => {
  const name = process.env.EMAIL_FROM_NAME || 'London Express Removals';
  const address = process.env.EMAIL_USER || 'hello@londonexpressremovals.co.uk';
  return `${name} <${address}>`;
};

/**
 * Core send function — used by every other helper.
 * Returns the Resend response on success, null on failure (so callers can
 * fire-and-forget without unhandled rejections killing the request).
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: buildFrom(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || subject,
    });

    if (error) {
      console.error('❌ Resend error:', error.message || JSON.stringify(error));
      return null;
    }

    console.log(`✅ Email sent to ${to} — id: ${data?.id}`);
    return data;
  } catch (err) {
    console.error('❌ Email error:', err.message);
    return null;
  }
};

/**
 * Send two emails in parallel when a new quote/booking comes in:
 *   1. Notification to the company (admin sees it in the inbox)
 *   2. Confirmation to the customer (they know we received it)
 */
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