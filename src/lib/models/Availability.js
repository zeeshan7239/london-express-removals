import mongoose from 'mongoose';

/**
 * Per-date availability rules set by the admin.
 * A date with no document uses the default daily limit (config below).
 *
 * blocked: true            → date fully unavailable regardless of count
 * maxBookings: N           → date allows at most N bookings
 */
const availabilitySchema = new mongoose.Schema(
  {
    // Stored as midnight-UTC date string for unique daily keys, e.g. '2026-07-04'
    date: { type: String, required: true, unique: true, index: true },
    blocked: { type: Boolean, default: false },
    maxBookings: { type: Number, min: 0 },
    note: { type: String, maxlength: 200 },   // admin-facing reason, e.g. "Bank holiday"
  },
  { timestamps: true }
);

// Default daily capacity when no per-date rule exists.
// Change this to match how many moves your team can do per day.
export const DEFAULT_DAILY_LIMIT = 4;

const Availability = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
export default Availability;
