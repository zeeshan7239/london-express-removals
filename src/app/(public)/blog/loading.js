import BlogSkeleton from '@/components/common/BlogSkeleton';

/**
 * This file is automatically shown by Next.js during navigation to /blog
 * while the server component fetches data. It replaces the "frozen" feeling
 * with an immediate visual response.
 */
export default function BlogLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 relative overflow-hidden">
        <div className="container-wide relative py-16 lg:py-24 animate-pulse">
          <div className="h-4 w-16 bg-white/20 rounded-full mb-4" />
          <div className="h-8 w-64 bg-white/20 rounded-full mb-3" />
          <div className="h-5 w-96 bg-white/10 rounded-full max-w-full" />
        </div>
      </div>
      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <BlogSkeleton />
        </div>
      </section>
    </div>
  );
}
