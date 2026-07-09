import BlogPostSkeleton from '@/components/common/BlogPostSkeleton';

/**
 * Next.js shows this immediately when navigating to /blog/[slug]
 * before the server fetches the post from MongoDB.
 * Eliminates the "frozen click" experience.
 */
export default function BlogPostLoading() {
  return <BlogPostSkeleton />;
}
