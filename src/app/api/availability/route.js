import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Availability, { DEFAULT_DAILY_LIMIT } from '@/lib/models/Availability.js';
import Quote from '@/lib/models/Quote.js';

/**
 * GET /api/availability?month=2026-07
 * Public — returns per-day availability for the booking date picker.
 * Response: { days: { '2026-07-01': { available: true, remaining: 3 }, ... } }
 */
export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const month = url.searchParams.get('month'); // 'YYYY-MM'
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ success: false, message: 'month=YYYY-MM required' }, { status: 400 });
    }

    const [y, m] = month.split('-').map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const monthStart = new Date(Date.UTC(y, m - 1, 1));
    const monthEnd = new Date(Date.UTC(y, m - 1, daysInMonth, 23, 59, 59));

    // Admin rules for this month
    const rules = await Availability.find({
      date: { $gte: `${month}-01`, $lte: `${month}-${String(daysInMonth).padStart(2, '0')}` },
    }).lean();
    const ruleMap = Object.fromEntries(rules.map((r) => [r.date, r]));

    // Booking counts per day (only statuses that occupy capacity)
    const counts = await Quote.aggregate([
      { $match: {
        movingDate: { $gte: monthStart, $lte: monthEnd },
        status: { $in: ['new', 'contacted', 'quoted', 'accepted', 'booked'] },
      }},
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$movingDate' } },
        count: { $sum: 1 },
      }},
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));

    const days = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${month}-${String(d).padStart(2, '0')}`;
      const rule = ruleMap[key];
      const limit = rule?.maxBookings ?? DEFAULT_DAILY_LIMIT;
      const used = countMap[key] || 0;
      const blocked = rule?.blocked === true;
      days[key] = {
        available: !blocked && used < limit,
        remaining: blocked ? 0 : Math.max(0, limit - used),
        blocked,
      };
    }

    return NextResponse.json({ success: true, month, days });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
