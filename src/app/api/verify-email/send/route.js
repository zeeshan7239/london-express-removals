import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import { sendOTP } from '@/lib/services/otpService.js';
import { isValidEmail } from '@/lib/utils/validation.js';

// POST /api/verify-email/send
// Body: { email: string }
// Sends a 6-digit code to the given email address.
export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const result = await sendOTP(email);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent — please check your email',
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    // Cooldown is a special case — return 429 (rate limited) with retry info
    if (err.code === 'COOLDOWN') {
      return NextResponse.json(
        { success: false, message: err.message, secondsLeft: err.secondsLeft },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || 'Could not send verification code' },
      { status: 500 }
    );
  }
}
