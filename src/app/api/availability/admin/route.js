import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Availability from '@/lib/models/Availability.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

const authErr = (err) => {
  if (err instanceof AuthError) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
  }
  return NextResponse.json({ success: false, message: err.message }, { status: 500 });
};

/**
 * GET /api/availability/admin?month=2026-07 — list raw rules for a month
 */
export async function GET(req) {
  try {
    await requireAdmin();
    await connectDB();
    const url = new URL(req.url);
    const month = url.searchParams.get('month');
    const filter = month && /^\d{4}-\d{2}$/.test(month)
      ? { date: { $regex: `^${month}` } }
      : {};
    const rules = await Availability.find(filter).sort('date').lean();
    return NextResponse.json({ success: true, rules });
  } catch (err) { return authErr(err); }
}

/**
 * POST /api/availability/admin
 * Body: { date: '2026-07-04', blocked?: true, maxBookings?: 2, note?: '...' }
 * Upserts the rule for that date.
 */
export async function POST(req) {
  try {
    await requireAdmin();
    await connectDB();
    const { date, blocked, maxBookings, note } = await req.json();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, message: 'date=YYYY-MM-DD required' }, { status: 400 });
    }
    const rule = await Availability.findOneAndUpdate(
      { date },
      {
        date,
        ...(blocked !== undefined ? { blocked: !!blocked } : {}),
        ...(maxBookings !== undefined ? { maxBookings: Number(maxBookings) } : {}),
        ...(note !== undefined ? { note } : {}),
      },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, rule });
  } catch (err) { return authErr(err); }
}

/**
 * DELETE /api/availability/admin
 * Body: { date: '2026-07-04' } — removes the rule (date reverts to default limit)
 */
export async function DELETE(req) {
  try {
    await requireAdmin();
    await connectDB();
    const { date } = await req.json();
    await Availability.findOneAndDelete({ date });
    return NextResponse.json({ success: true, message: 'Rule removed' });
  } catch (err) { return authErr(err); }
}
