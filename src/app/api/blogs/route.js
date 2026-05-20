import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Blog from '@/lib/models/Blog.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const { category, tag, page = 1, limit = 10, q } = Object.fromEntries(url.searchParams);

    const filter = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
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

    return NextResponse.json({ success: true, count: blogs.length, total, page: Number(page), blogs });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message, blogs: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const blog = await Blog.create(data);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
