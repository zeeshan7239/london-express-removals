import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAuth, AuthError } from '@/lib/middleware/auth.js';

// GET /api/quotes/mine
// Returns the current user's bookings + any guest bookings made with their email.
export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();

    // Match either by linked user OR by matching customer email
    // (handles guest bookings made before signup, same email)
    const quotes = await Quote.find({
      $or: [
        { user: user._id },
        { 'customer.email': user.email },
      ],
    })
      .sort('-createdAt')
      .lean();

    return NextResponse.json({ success: true, count: quotes.length, quotes });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
