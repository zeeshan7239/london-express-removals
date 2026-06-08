'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/utils/api';

const CATEGORIES = ['Moving Tips', 'Packing', 'London Areas', 'Company News', 'Guides'];

export default function BlogForm({ initial = {}, isEdit = false }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title:           initial.title           || '',
    excerpt:         initial.excerpt         || '',
    content:         initial.content         || '',
    coverImage:      initial.coverImage      || '',
    category:        initial.category        || 'Moving Tips',
    tags:            initial.tags?.join(', ') || '',
    metaTitle:       initial.metaTitle       || '',
    metaDescription: initial.metaDescription || '',
    readTime:        initial.readTime        || '',
    published:       initial.published       ?? true,
    author: {
      name:   initial.author?.name   || 'London Express Removals',
      avatar: initial.author?.avatar || '',
    },
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   return toast.error('Title is required');
    if (!form.content.trim()) return toast.error('Content is required');

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (isEdit) {
        await api.put(`/blogs/${initial.slug}`, payload);
        toast.success('Post updated successfully');
      } else {
        await api.post('/blogs', payload);
        toast.success('Post created successfully');
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-ink-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="heading-display text-2xl lg:text-3xl">
            {isEdit ? 'Edit Post' : 'New Blog Post'}
          </h1>
          <p className="text-ink-600 text-sm mt-0.5">
            {isEdit ? `Editing: ${initial.title}` : 'Fill in the details below to create a new post.'}
          </p>
        </div>
        <button
          onClick={() => set('published', !form.published)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition ${
            form.published
              ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
              : 'border-ink-200 text-ink-600 bg-white'
          }`}
        >
          {form.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {form.published ? 'Published' : 'Draft'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Moving to Clapham — The Complete 2025 Guide"
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-base font-semibold focus:outline-none focus:border-ember-400"
              />
              <p className="text-xs text-ink-400 mt-1.5">{form.title.length}/200 characters</p>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A short summary shown on the blog listing page..."
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm resize-none focus:outline-none focus:border-ember-400"
              />
              <p className="text-xs text-ink-400 mt-1.5">{form.excerpt.length}/300 characters</p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-ink-400 mb-3">
                Supports Markdown — use ## for headings, **bold**, *italic*, - for lists.
              </p>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                placeholder="Write your blog post content here using Markdown..."
                rows={24}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm font-mono resize-y focus:outline-none focus:border-ember-400"
              />
            </div>

          </div>

          {/* Right — sidebar */}
          <div className="space-y-5">

            {/* Publish */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <h3 className="font-display font-bold text-sm mb-4">Publish</h3>
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ember-500 text-white font-bold text-sm shadow-glow-ember hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0"
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><Save className="w-4 h-4" /> {isEdit ? 'Save changes' : 'Publish post'}</>
                }
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full mt-2 px-5 py-3 rounded-full border-2 border-ink-200 text-sm font-bold text-ink-600 hover:border-ink-400 transition"
              >
                Cancel
              </button>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5 space-y-4">
              <h3 className="font-display font-bold text-sm">Category & Tags</h3>
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="clapham, south london, moving tips"
                  className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
                />
                <p className="text-xs text-ink-400 mt-1">Comma-separated</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5">Read time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => set('readTime', e.target.value)}
                  placeholder="e.g. 8 min read"
                  className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
                />
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <h3 className="font-display font-bold text-sm mb-3">Cover Image</h3>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
              />
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="mt-3 w-full h-32 object-cover rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <p className="text-xs text-ink-400 mt-1.5">Paste a direct image URL</p>
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5">
              <h3 className="font-display font-bold text-sm mb-3">Author</h3>
              <label className="block text-xs font-semibold text-ink-500 mb-1.5">Name</label>
              <input
                type="text"
                value={form.author.name}
                onChange={(e) => setForm((f) => ({ ...f, author: { ...f.author, name: e.target.value } }))}
                className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-ink-100 p-5 space-y-3">
              <h3 className="font-display font-bold text-sm">SEO</h3>
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5">
                  Meta title <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => set('metaTitle', e.target.value)}
                  placeholder="Override the page title for Google"
                  className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm focus:outline-none focus:border-ember-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5">
                  Meta description <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => set('metaDescription', e.target.value)}
                  placeholder="Override the meta description for Google..."
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2.5 rounded-xl border border-ink-200 text-sm resize-none focus:outline-none focus:border-ember-400"
                />
                <p className="text-xs text-ink-400 mt-1">{form.metaDescription.length}/160 characters</p>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
