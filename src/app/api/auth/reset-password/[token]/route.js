import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';
import { buildCookieOptions } from '@/lib/middleware/auth.js';

export async function POST(req, { params }) {
  try {
    const { token } = await params;
    const { password } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const jwtToken = user.getSignedJwtToken();
    const res = NextResponse.json({ success: true, token: jwtToken });
    res.cookies.set('token', jwtToken, buildCookieOptions());
    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Reset failed' },
      { status: 500 }
    );
  }
}
