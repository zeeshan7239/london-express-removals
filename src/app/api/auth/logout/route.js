import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' });
  res.cookies.set('token', '', { expires: new Date(0), httpOnly: true, path: '/' });
  return res;
}
