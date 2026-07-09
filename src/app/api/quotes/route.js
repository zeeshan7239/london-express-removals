import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { getCurrentUser, requireAdmin, AuthError } from '@/lib/middleware/auth.js';
import { sendQuoteEmails } from '@/lib/services/emailService.js';
import { sendWhatsAppNotification } from '@/lib/services/whatsappService.js';
import { getAvailableTimeSlots } from '@/lib/utils/timeSlots.js';

// POST /api/quotes — create a new booking or quote (public)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const payload = { ...body };
    if (!payload.kind) payload.kind = 'booking';

    // ── Server-side same-day time validation ──────────────────────────────────
    // Defence in depth: even if the client is bypassed, reject bookings
    // whose preferredTime has already passed (or every slot has passed).
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

    // Link to authenticated user if present (cookie auth)
    const user = await getCurrentUser();
    if (user) payload.user = user._id;

    const quote = await Quote.create(payload);

    // Fire-and-forget notifications
    sendQuoteEmails(quote).catch((e) => console.error('Email error:', e.message));
    sendWhatsAppNotification(quote).catch((e) => console.error('WA error:', e.message));

    return NextResponse.json({
      success: true,
      message: 'Quote received — we\'ll be in touch shortly.',
      quote,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Could not create quote' },
      { status: err.name === 'ValidationError' ? 400 : 500 }
    );
  }
}

// GET /api/quotes — admin: list all
export async function GET(req) {
  try {
    await requireAdmin();
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;

    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter)
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit);
    const total = await Quote.countDocuments(filter);

    return NextResponse.json({ success: true, count: quotes.length, total, page, quotes });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
