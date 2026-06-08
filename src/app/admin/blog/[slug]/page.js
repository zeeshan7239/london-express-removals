'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import BlogForm from '../BlogForm';
import api from '@/lib/utils/api';
import toast from 'react-hot-toast';

export default function EditBlogPage() {
  const { slug } = useParams();
  const [blog, setBlog]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/blogs/admin/${slug}`);
        setBlog(data.blog);
      } catch {
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-10 text-center text-red-600">
        Post not found.
      </div>
    );
  }

  return <BlogForm initial={blog} isEdit={true} />;
}
