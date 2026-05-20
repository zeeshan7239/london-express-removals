import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/services/pricingService.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = calculatePrice(body || {});
    return NextResponse.json({ success: result.ok, ...result });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Calculation failed' },
      { status: 500 }
    );
  }
}
