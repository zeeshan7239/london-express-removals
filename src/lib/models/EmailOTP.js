import mongoose from 'mongoose';

/**
 * Stores email verification codes for guest bookings.
 *
 * Flow:
 *  - When a guest enters their email at checkout, we create an EmailOTP doc
 *    with a random 6-digit code and a 10-minute expiry.
 *  - We email the code to them.
 *  - When they submit it, we look up the doc, verify it matches, and mark
 *    `verified: true`.
 *  - The /api/quotes route then only accepts bookings whose email has a
 *    matching, still-valid `verified: true` EmailOTP in the last 30 minutes.
 *
 * The `expiresAt` field uses a MongoDB TTL index — Mongo automatically deletes
 * documents after they expire, so we don't accumulate stale codes.
 */
const emailOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
    // 6 digits, string so leading zeros are preserved
  },
  attempts: {
    type: Number,
    default: 0,
    // Max 5 wrong attempts, then this code is dead and they have to request another
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
    // TTL index — Mongo will auto-delete once this date passes
    index: { expires: 0 },
  },
}, {
  timestamps: true,
});

// Prevent hot-reload from redefining model in dev
export default mongoose.models.EmailOTP || mongoose.model('EmailOTP', emailOTPSchema);
