import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { getCurrentUser } from '@/lib/middleware/auth.js';
import { sendQuoteEmails } from '@/lib/services/emailService.js';
import { sendWhatsAppNotification } from '@/lib/services/whatsappService.js';
import { getAvailableTimeSlots } from '@/lib/utils/timeSlots.js';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const payload = { ...body, kind: 'quote' };

    // Server-side same-day time validation (defence in depth)
    if (payload.movingDate) {
      const date = new Date(payload.movingDate);
      if (!isNaN(date.getTime())) {
        const dateStr = date.toISOString().slice(0, 10);
        const { slots, sameDayClosed } = getAvailableTimeSlots(dateStr, new Date());
        if (sameDayClosed) {
          return NextResponse.json(
            { success: false, message: 'Online booking for today is no longer available. Please select another date or contact us directly.' },
            { status: 400 }
          );
        }
        if (payload.preferredTime && !slots.includes(payload.preferredTime)) {
          return NextResponse.json(
            { success: false, message: 'That time slot is no longer available. Please choose another time.' },
            { status: 400 }
          );
        }
      }
    }

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
