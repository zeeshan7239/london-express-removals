import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Blog from '@/lib/models/Blog.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

// GET /api/blogs/admin — returns ALL blogs including drafts for the admin panel
export async function GET(req) {
  try {
    await requireAdmin();
    await connectDB();

    const url = new URL(req.url);
    const { category, page = 1, limit = 100, q } = Object.fromEntries(url.searchParams);

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
    ];

    const blogs = await Blog.find(filter)
      .select('-content')
      .sort('-createdAt')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({ success: true, count: blogs.length, total, blogs });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
