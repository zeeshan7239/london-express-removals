import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Blog from '@/lib/models/Blog.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

// GET /api/blogs/admin/[slug] — returns single blog including unpublished (for edit page)
export async function GET(req, { params }) {
  try {
    await requireAdmin();
    const { slug } = await params;
    await connectDB();

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, blog });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
