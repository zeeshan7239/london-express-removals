'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2,
  BookOpen, Search, ArrowRight,
} from 'lucide-react';
import api from '@/lib/utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Moving Tips', 'Packing', 'London Areas', 'Company News', 'Guides'];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminBlogPage() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [deleting, setDeleting] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (category !== 'All') params.set('category', category);
      if (search) params.set('q', search);
      // Admin needs all blogs including unpublished — hit a separate admin endpoint
      const { data } = await api.get(`/blogs/admin?${params}`);
      setBlogs(data.blogs || []);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const togglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog.slug}`, { published: !blog.published });
      toast.success(blog.published ? 'Post unpublished' : 'Post published');
      fetchBlogs();
    } catch {
      toast.error('Failed to update post');
    }
  };

  const deleteBlog = async (slug) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(slug);
    try {
      await api.delete(`/blogs/${slug}`);
      toast.success('Post deleted');
      fetchBlogs();
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-display text-3xl mb-1">Blog Posts</h1>
          <p className="text-ink-600">Create, edit and manage your blog content.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ember-500 text-white font-bold text-sm shadow-glow-ember hover:-translate-y-0.5 transition"
        >
          <Plus className="w-4 h-4" /> New post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-ink-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                category === c ? 'bg-ember-500 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-ink-300" />
            <p className="font-display font-bold text-ink-600 mb-1">No posts yet</p>
            <p className="text-sm text-ink-500 mb-4">Create your first blog post to get started.</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 text-sm font-bold text-ember-600 hover:underline"
            >
              Create a post <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden lg:table w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Title</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Category</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Views</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-ink-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-900 line-clamp-1 max-w-xs">{b.title}</div>
                      <div className="text-xs text-ink-400 mt-0.5">/{b.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 text-xs font-semibold">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-600">{b.views ?? 0}</td>
                    <td className="px-5 py-4 text-ink-500">{formatDate(b.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-ink-100 text-ink-500 hover:text-ink-900 transition"
                          title="View live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => togglePublish(b)}
                          className={`p-2 rounded-lg transition ${
                            b.published
                              ? 'hover:bg-amber-50 text-ink-500 hover:text-amber-600'
                              : 'hover:bg-emerald-50 text-ink-500 hover:text-emerald-600'
                          }`}
                          title={b.published ? 'Unpublish' : 'Publish'}
                        >
                          {b.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/admin/blog/${b.slug}`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-ink-500 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteBlog(b.slug)}
                          disabled={deleting === b.slug}
                          className="p-2 rounded-lg hover:bg-red-50 text-ink-500 hover:text-red-600 transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === b.slug
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-ink-100">
              {blogs.map((b) => (
                <div key={b._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">{b.title}</p>
                      <p className="text-xs text-ink-400 mt-0.5">/{b.slug}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${
                      b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {b.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
                    <span>{b.category}</span>
                    <span>·</span>
                    <span>{formatDate(b.createdAt)}</span>
                    <span>·</span>
                    <span>{b.views ?? 0} views</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/${b.slug}`}
                      className="flex-1 text-center py-2 rounded-xl bg-ink-50 text-sm font-semibold text-ink-700 hover:bg-ink-100 transition">
                      Edit
                    </Link>
                    <button onClick={() => togglePublish(b)}
                      className="flex-1 py-2 rounded-xl bg-ink-50 text-sm font-semibold text-ink-700 hover:bg-ink-100 transition">
                      {b.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => deleteBlog(b.slug)}
                      className="px-4 py-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
