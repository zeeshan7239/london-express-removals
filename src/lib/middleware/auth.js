import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/connect.js';
import User from '@/lib/models/User.js';

/**
 * Build the auth cookie config used by login/register/reset.
 */
export const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60,
});

/**
 * Get the currently authenticated user from the request, or null if anonymous.
 * Reads the token from the HTTP-only cookie. Used by route handlers via:
 *   const user = await getCurrentUser(req);
 *
 * Note: cookies() is async in Next.js 15+ (was sync in 14). We await it
 * unconditionally — works correctly on both versions.
 */
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id);
    return user || null;
  } catch {
    return null;
  }
};

/**
 * Throw if the user isn't authenticated. Catch in route handlers to send 401.
 */
export class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) throw new AuthError('Not authorized');
  return user;
};

export const requireAdmin = async () => {
  const user = await requireAuth();
  if (user.role !== 'admin') throw new AuthError('Admin access only', 403);
  return user;
};