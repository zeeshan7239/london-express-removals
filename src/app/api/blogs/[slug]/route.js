import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect.js';
import Blog from '@/lib/models/Blog.js';
import { requireAdmin, AuthError } from '@/lib/middleware/auth.js';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOneAndUpdate(
      { slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, blog });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const data = await req.json();
    await connectDB();
    const blog = await Blog.findOneAndUpdate({ slug }, data, { new: true, runValidators: true });
    if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    return NextResponse.json({ success: true, blog });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOneAndDelete({ slug });
    if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
