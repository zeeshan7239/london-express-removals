import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';
import { sendAssemblyQuoteEmail } from '@/lib/services/emailService.js';

// POST /api/quotes/:id/assembly  (admin only)
// Sets the flat-pack assembly charge. It is added on top of the removal price;
// the standard calculator price is never changed.
export async function POST(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { charge, note, notify } = await req.json();

    const amount = Number(charge);
    if (!Number.isFinite(amount) || amount < 0 || amount > 10000) {
      return NextResponse.json({ success: false, message: 'Enter an assembly charge between £0 and £10,000.' }, { status: 400 });
    }

    await connectDB();
    const quote = await Quote.findById(id);
    if (!quote) return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    if (!quote.flatPack?.required) {
      return NextResponse.json({ success: false, message: 'This booking has no flat-pack assembly.' }, { status: 400 });
    }

    quote.flatPack.assemblyCharge = Math.round(amount * 100) / 100;
    quote.flatPack.assemblyNote = String(note || '').slice(0, 1000);
    quote.flatPack.quotedAt = new Date();
    await quote.save();

    if (notify !== false) {
      sendAssemblyQuoteEmail(quote).catch((e) => console.error('Assembly email error:', e.message));
    }
    return NextResponse.json({ success: true, message: notify === false ? 'Assembly charge saved' : 'Assembly charge saved · customer notified', quote });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
