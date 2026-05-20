import { NextResponse } from 'next/server';
import { coverageCheck } from '@/lib/services/pricingService.js';

export async function GET(req) {
  const url = new URL(req.url);
  const pickup = url.searchParams.get('pickup');
  const delivery = url.searchParams.get('delivery');
  return NextResponse.json({ success: true, coverage: coverageCheck(pickup, delivery) });
}
