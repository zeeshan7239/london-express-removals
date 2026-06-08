import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { marked } from 'marked';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';
import CTABanner from '@/components/home/CTABanner';
import ShareButton from '@/components/common/ShareButton';
import { siteConfig } from '@/lib/utils/siteConfig';

export const revalidate = 300;

// Configure marked for clean, safe output
marked.setOptions({
  gfm: true,        // GitHub-flavoured Markdown (tables, strikethrough etc.)
  breaks: true,     // Line breaks become <br>
});

async function getBlog(slug) {
  try {
    await connectDB();
    const blog = await Blog.findOneAndUpdate(
      { slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    if (blog) return JSON.parse(JSON.stringify(blog));
  } catch (err) {
    console.error('Blog fetch error:', err.message);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Post not found' };

  return {
    title: blog.metaTitle || `${blog.title} | London Express Removals`,
    description: blog.metaDescription || blog.excerpt || siteConfig.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name || siteConfig.name],
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  // Convert Markdown content to HTML for rendering
  const contentHtml = marked(blog.content || '');

  // Article structured data for Google rich results
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: blog.author?.name || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/favicon.svg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section
        className={`relative bg-gradient-to-br ${
          blog.coverGradient || 'from-ink-900 to-ink-800'
        } text-white overflow-hidden`}
      >
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="container-wide relative py-20 lg:py-28 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>

          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-wider mb-6">
            {blog.category}
          </span>

          <h1 className="heading-display !text-white text-3xl md:text-5xl leading-tight mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-2xl">
              {blog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(blog.createdAt)}
            </span>
            {blog.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {blog.readTime}
              </span>
            )}
            {blog.author?.name && <span>By {blog.author.name}</span>}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article body */}
      <article className="py-20">
        <div className="container-wide max-w-3xl">
          <div
            className="
              prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-ink-900
              prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2
              prose-p:text-ink-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-ember-600 prose-a:font-semibold hover:prose-a:text-ember-700
              prose-strong:text-ink-900
              prose-ul:text-ink-700 prose-ul:my-4
              prose-ol:text-ink-700 prose-ol:my-4
              prose-li:my-1
              prose-blockquote:border-l-ember-500 prose-blockquote:text-ink-600 prose-blockquote:italic
              prose-table:text-sm
              prose-th:bg-ink-50 prose-th:text-ink-700 prose-th:font-bold
              prose-td:text-ink-700
              prose-hr:border-ink-200
              prose-code:text-ember-600 prose-code:bg-ink-50 prose-code:px-1 prose-code:rounded
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-ink-100 flex items-center justify-between">
            <div className="text-sm text-ink-500">Found this useful?</div>
            <ShareButton title={blog.title} />
          </div>
        </div>
      </article>

      <CTABanner />
    </>
  );
}