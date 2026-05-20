import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Quote from '@/lib/models/Quote.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

const handleAuthError = (err) => {
  if (err instanceof AuthError) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
  }
  return NextResponse.json({ success: false, message: err.message }, { status: 500 });
};

export async function GET(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await connectDB();
    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, quote });
  } catch (err) { return handleAuthError(err); }
}

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const quote = await Quote.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, quote });
  } catch (err) { return handleAuthError(err); }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await connectDB();
    const quote = await Quote.findByIdAndDelete(id);
    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Quote deleted' });
  } catch (err) { return handleAuthError(err); }
}
