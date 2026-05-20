import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';
import { buildCookieOptions } from '@/lib/middleware/auth.js';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

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
    });

    res.cookies.set('token', token, buildCookieOptions());
    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
