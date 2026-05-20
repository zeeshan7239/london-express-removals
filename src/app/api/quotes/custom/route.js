import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { getCurrentUser } from '@/lib/middleware/auth.js';
import { sendQuoteEmails } from '@/lib/services/emailService.js';
import { sendWhatsAppNotification } from '@/lib/services/whatsappService.js';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const payload = { ...body, kind: 'quote' };

    const user = await getCurrentUser();
    if (user) payload.user = user._id;

    const quote = await Quote.create(payload);

    sendQuoteEmails(quote).catch((e) => console.error('Email error:', e.message));
    sendWhatsAppNotification(quote).catch((e) => console.error('WA error:', e.message));

    return NextResponse.json({
      success: true,
      message: 'Custom quote request received',
      quote,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Could not create quote' },
      { status: err.name === 'ValidationError' ? 400 : 500 }
    );
  }
}
