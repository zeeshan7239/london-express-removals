import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';
import PageHeader from '@/components/common/PageHeader';
import CTABanner from '@/components/home/CTABanner';
import { Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';

export const revalidate = 300;

async function getBlog(slug) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    if (!blog) return null;
    return JSON.parse(JSON.stringify(blog));
  } catch {
    return null;
  }
}

// Per-post SEO metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Post not found' };

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || siteConfig.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name || siteConfig.name],
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
  };
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric',
});

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  // Article structured data for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Organization', name: blog.author?.name || siteConfig.name },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.url}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageHeader
        eyebrow={blog.category}
        title={blog.title}
        subtitle={blog.excerpt}
      />

      <article className="py-12 lg:py-16">
        <div className="container-wide max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ember-600 mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          <div className="flex items-center gap-4 text-xs text-ink-500 mb-6 pb-6 border-b border-ink-100">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3 h-3" /> {blog.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" /> {blog.views || 0} views
            </span>
          </div>

          {blog.coverImage && (
            <div className="aspect-video rounded-3xl overflow-hidden mb-8 bg-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-ember-600 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      <CTABanner />
    </>
  );
}
