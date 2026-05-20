import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAuth, AuthError } from '@/lib/middleware/auth.js';

// GET /api/quotes/mine/[id]
// Returns a single quote — only if the current user owns it.
export async function GET(req, { params }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await connectDB();

    const quote = await Quote.findById(id).lean();
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    // Ownership check — match by user ID or by customer email (guest bookings)
    const ownsByUserId = quote.user && quote.user.toString() === user._id.toString();
    const ownsByEmail = quote.customer?.email?.toLowerCase() === user.email.toLowerCase();
    if (!ownsByUserId && !ownsByEmail) {
      return NextResponse.json({ success: false, message: 'Not authorised' }, { status: 403 });
    }

    return NextResponse.json({ success: true, quote });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
