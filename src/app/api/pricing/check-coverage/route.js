import { NextResponse } from 'next/server';
import { checkServiceArea } from '@/lib/services/serviceArea.js';
import { resolveLocations } from '@/lib/services/locationService.js';

const MAX_POSTCODES = 8;

// POST { postcodes: ['SW1A 1AA', ...] }  ->  { results: [{ status, postcode, message, ... }] }
// status: inside | outside | invalid | not_found | unavailable
export async function POST(req) {
  try {
    const body = await req.json();
    // items: [{ postcode, placeId? }] — plain postcode strings are accepted too
    const raw = Array.isArray(body?.items) ? body.items : (Array.isArray(body?.postcodes) ? body.postcodes : []);
    const list = raw.slice(0, MAX_POSTCODES).map((i) => (typeof i === 'string' ? { postcode: i } : { postcode: i?.postcode, placeId: i?.placeId }));
    const results = await resolveLocations(list);
    // Never hand coordinates back to the browser for use in pricing: the server looks them up again.
    return NextResponse.json({
      success: true,
      results: results.map(({ status, postcode, message, adminDistrict }) => ({ status, postcode, message, adminDistrict })),
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Could not check postcodes' }, { status: 400 });
  }
}

// GET ?pickup=&delivery=  (kept for existing callers)
export async function GET(req) {
  const url = new URL(req.url);
  const [pickup, delivery] = await Promise.all([
    checkServiceArea(url.searchParams.get('pickup')),
    checkServiceArea(url.searchParams.get('delivery')),
  ]);
  const pick = ({ status, postcode, message }) => ({ status, postcode, message });
  return NextResponse.json({
    success: true,
    coverage: {
      pickup: pick(pickup),
      delivery: pick(delivery),
      bothInside: pickup.status === 'inside' && delivery.status === 'inside',
    },
  });
}
