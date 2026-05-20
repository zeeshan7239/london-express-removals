import { NextResponse } from 'next/server';
import pricingConfig from '@/lib/services/pricingConfig.js';

export async function GET() {
  return NextResponse.json({
    success: true,
    config: {
      currency: pricingConfig.currency,
      currencySymbol: pricingConfig.currencySymbol,
      teams: pricingConfig.teams,
      floorBands: pricingConfig.floorBands,
      propertyTypes: pricingConfig.propertyTypes,
      durations: pricingConfig.durations,
      distance: pricingConfig.distance,
      shortTrip: pricingConfig.shortTrip,
    },
  });
}
