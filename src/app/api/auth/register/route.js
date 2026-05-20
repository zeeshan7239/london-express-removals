import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';
import { buildCookieOptions } from '@/lib/middleware/auth.js';
import { sendWelcomeEmail } from '@/lib/services/emailService.js';

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
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    const user = await User.create({ fullName, email, phone, password });
    sendWelcomeEmail(user).catch(() => {});

    const token = user.getSignedJwtToken();
    const res = NextResponse.json({
      success: true,
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
