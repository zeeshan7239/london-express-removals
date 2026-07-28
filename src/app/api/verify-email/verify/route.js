import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import { verifyOTP } from '@/lib/services/otpService.js';
import { isValidEmail } from '@/lib/utils/validation.js';

// POST /api/verify-email/verify
// Body: { email: string, code: string }
// Marks the email as verified for the next 30 minutes.
export async function POST(req) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    if (!code || !/^\d{6}$/.test(String(code).trim())) {
      return NextResponse.json(
        { success: false, message: 'Please enter the 6-digit code' },
        { status: 400 }
      );
    }

    const result = await verifyOTP(email, code);

    return NextResponse.json({
      success: true,
      message: 'Email verified',
      verifiedAt: result.verifiedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Could not verify code' },
      { status: 400 }
    );
  }
}
