import { NextResponse } from 'next/server';
import { getAddressesForPostcode } from '@/lib/services/addressService.js';

export async function GET(req, { params }) {
  try {
    const { postcode } = await params;
    const result = await getAddressesForPostcode(postcode);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message, addresses: [] },
      { status: 500 }
    );
  }
}
