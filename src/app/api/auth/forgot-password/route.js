import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';
import { sendPasswordResetEmail } from '@/lib/services/emailService.js';
import { siteConfig } from '@/lib/utils/siteConfig.js';

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();
    const user = await User.findOne({ email });
    // Don't reveal whether the email exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${siteConfig.url}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user, resetUrl);

    return NextResponse.json({ success: true, message: 'Reset email sent.' });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Could not send reset email' },
      { status: 500 }
    );
  }
}
