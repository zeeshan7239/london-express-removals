import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';
import { sendQuoteAcceptedEmail } from '@/lib/services/emailService.js';
import { sendCustomerConfirmationWhatsApp } from '@/lib/services/whatsappService.js';

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { message, estimatedPrice } = await req.json();

    await connectDB();
    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }

    quote.status = 'accepted';
    if (estimatedPrice !== undefined && estimatedPrice !== '') {
      quote.estimatedPrice = Number(estimatedPrice);
    }
    quote.adminResponse = {
      message: message || '',
      respondedAt: new Date(),
      respondedBy: admin._id,
    };
    await quote.save();

    sendQuoteAcceptedEmail(quote, message, quote.estimatedPrice)
      .catch((e) => console.error('Accept email error:', e.message));
    sendCustomerConfirmationWhatsApp(quote, quote.estimatedPrice)
      .catch((e) => console.error('Accept WhatsApp error:', e.message));

    return NextResponse.json({ success: true, message: 'Quote accepted, customer notified', quote });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
