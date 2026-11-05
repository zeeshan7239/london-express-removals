import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/services/pricingService.js';
import { resolveLocations } from '@/lib/services/locationService.js';

// The browser sends postcodes, NOT coordinates. Positions come from our own
// lookup, and nothing is priced unless both postcodes are inside London / M25.
export async function POST(req) {
  try {
    const body = (await req.json()) || {};
    const [pickup, delivery] = await resolveLocations([
      { postcode: body.pickupPostcode, placeId: body.pickupPlaceId },
      { postcode: body.deliveryPostcode, placeId: body.deliveryPlaceId },
    ]);

    const blocked = [pickup, delivery].find((r) => r.status !== 'inside');
    if (blocked) {
      const reason = blocked.status === 'outside' ? 'outside_service_area'
        : blocked.status === 'unavailable' ? 'lookup_unavailable' : 'invalid_postcode';
      return NextResponse.json({ success: false, ok: false, reason, message: blocked.message });
    }

    const result = calculatePrice({
      ...body,
      pickupLatLng: { lat: pickup.lat, lon: pickup.lon },
      deliveryLatLng: { lat: delivery.lat, lon: delivery.lon },
    });
    return NextResponse.json({ success: result.ok, ...result });
  } catch (err) {
    return NextResponse.json(
      { success: false, ok: false, message: err.message || 'Calculation failed' },
      { status: 500 }
    );
  }
}
