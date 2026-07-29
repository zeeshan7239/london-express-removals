import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';
import { buildCookieOptions } from '@/lib/middleware/auth.js';
import { sendWelcomeEmail } from '@/lib/services/emailService.js';
import { isEmailVerified } from '@/lib/services/otpService.js';

export async function POST(req) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // ── Server-side email verification check ────────────────────────────
    // Even if someone bypasses the frontend, we reject registration unless
    // this email was verified via OTP in the last 30 minutes.
    const verified = await isEmailVerified(email);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email address before creating an account' },
        { status: 400 }
      );
    }

    if (await User.findOne({ email })) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Mark the account as verified since we just confirmed the email above
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      isVerified: true,
    });

    // Fire the welcome email but don't block the response on it —
    // if SMTP is slow, we don't want the user waiting.
    sendWelcomeEmail(user).catch((err) =>
      console.error('Failed to send welcome email:', err.message)
    );

    // Sign a JWT and return it in both the body (for clients that want it)
    // and as an HTTP-only cookie (so the browser is auto-authenticated).
    const token = user.getSignedJwtToken();
    const res = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    }, { status: 201 });

    res.cookies.set('token', token, buildCookieOptions());
    return res;
  } catch (err) {
    console.error('Register error:', err.message);
    return NextResponse.json(
      { success: false, message: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}