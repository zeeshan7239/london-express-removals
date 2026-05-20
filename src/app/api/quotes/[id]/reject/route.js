import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';
import { sendQuoteRejectedEmail } from '@/lib/services/emailService.js';

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { message } = await req.json();

    await connectDB();
    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }

    quote.status = 'rejected';
    quote.adminResponse = {
      message: message || '',
      respondedAt: new Date(),
      respondedBy: admin._id,
    };
    await quote.save();

    sendQuoteRejectedEmail(quote, message)
      .catch((e) => console.error('Reject email error:', e.message));

    return NextResponse.json({ success: true, message: 'Quote rejected, customer notified', quote });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
