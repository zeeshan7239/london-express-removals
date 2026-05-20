import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const [total, byStatus, last30, recent] = await Promise.all([
      Quote.countDocuments(),
      Quote.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Quote.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Quote.find().sort('-createdAt').limit(5).select('customer movingType status createdAt pickup delivery'),
    ]);

    const statusMap = byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});

    return NextResponse.json({
      success: true,
      stats: {
        total,
        last30Days: last30,
        new: statusMap.new || 0,
        accepted: statusMap.accepted || 0,
        rejected: statusMap.rejected || 0,
        completed: statusMap.completed || 0,
        byStatus: statusMap,
        recent,
      },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
