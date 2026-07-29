import crypto from 'crypto';
import EmailOTP from '@/lib/models/EmailOTP.js';
import { sendEmail } from '@/lib/services/emailService.js';
import { otpEmailTemplate } from '@/lib/templates/otpEmailTemplate.js';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const VERIFICATION_VALID_FOR_MINUTES = 30;

/**
 * Cryptographically random 6-digit code as a string.
 * Padded with leading zeros so "012345" is possible.
 */
const generateCode = () => {
  const num = crypto.randomInt(0, 1_000_000);
  return String(num).padStart(6, '0');
};

/**
 * Create + email a new OTP for the given address.
 *
 * If a fresh OTP was created for this email within the last minute we throw a
 * cooldown error — stops someone spamming the endpoint to send 100 emails.
 */
export const sendOTP = async (email) => {
  const normalized = String(email || '').toLowerCase().trim();
  if (!normalized) {
    throw new Error('Email is required');
  }

  // Cooldown: reject if we sent a code in the last 60 seconds
  const cooldownAgo = new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000);
  const recent = await EmailOTP.findOne({
    email: normalized,
    createdAt: { $gt: cooldownAgo },
  }).sort('-createdAt');

  if (recent) {
    const secondsLeft = Math.ceil(
      (RESEND_COOLDOWN_SECONDS * 1000 - (Date.now() - new Date(recent.createdAt).getTime())) / 1000
    );
    const err = new Error(`Please wait ${secondsLeft}s before requesting another code`);
    err.code = 'COOLDOWN';
    err.secondsLeft = secondsLeft;
    throw err;
  }

  // Invalidate any previous unverified codes for this email — one active code at a time
  await EmailOTP.deleteMany({ email: normalized, verified: false });

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const doc = await EmailOTP.create({ email: normalized, code, expiresAt });

  // Await the email send — with Resend (single HTTPS API call), this is fast
  // (~200ms) and ensures Vercel doesn't kill the serverless function before
  // the email actually leaves. On the old SMTP setup this would have been
  // slow, but on Resend it's the right call.
  try {
    const info = await sendEmail({
      to: normalized,
      subject: `Your verification code: ${code}`,
      html: otpEmailTemplate(code, OTP_EXPIRY_MINUTES),
    });
    console.log('✅ OTP email sent to:', normalized, 'id:', info?.id);
  } catch (err) {
    console.error('❌ OTP email failed for:', normalized, err.message);
    // Intentionally don't throw — the OTP is saved to DB, so if the email
    // does eventually arrive the user can still use it. The frontend still
    // sees a success and shows the "enter code" step.
  }

  return {
    email: normalized,
    expiresAt: doc.expiresAt,
    // Never return the actual code — it's only sent via email
  };
};

/**
 * Verify a code the user submitted.
 * On success, marks the OTP as verified so we can trust it at booking time.
 */
export const verifyOTP = async (email, code) => {
  const normalized = String(email || '').toLowerCase().trim();
  const submittedCode = String(code || '').trim();

  if (!normalized || !submittedCode) {
    throw new Error('Email and code are required');
  }
  if (!/^\d{6}$/.test(submittedCode)) {
    throw new Error('Code must be 6 digits');
  }

  const otp = await EmailOTP.findOne({
    email: normalized,
    verified: false,
    expiresAt: { $gt: new Date() },
  }).sort('-createdAt');

  if (!otp) {
    throw new Error('No active verification code — please request a new one');
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    throw new Error('Too many attempts — please request a new code');
  }

  if (otp.code !== submittedCode) {
    otp.attempts += 1;
    await otp.save();
    const left = MAX_ATTEMPTS - otp.attempts;
    throw new Error(`Incorrect code (${left} attempt${left === 1 ? '' : 's'} left)`);
  }

  otp.verified = true;
  otp.verifiedAt = new Date();
  await otp.save();

  return { email: normalized, verifiedAt: otp.verifiedAt };
};

/**
 * Called by /api/quotes when a guest booking comes in.
 * Returns true only if the email had a successful verification in the recent window.
 */
export const isEmailVerified = async (email) => {
  const normalized = String(email || '').toLowerCase().trim();
  if (!normalized) return false;

  const cutoff = new Date(Date.now() - VERIFICATION_VALID_FOR_MINUTES * 60 * 1000);
  const verified = await EmailOTP.findOne({
    email: normalized,
    verified: true,
    verifiedAt: { $gt: cutoff },
  });

  return !!verified;
};