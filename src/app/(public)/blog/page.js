import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import CTABanner from '@/components/home/CTABanner';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

export const metadata = {
  title: 'Moving Tips & London Removals Blog',
  description: 'Expert moving tips, London neighborhood guides, packing advice, and removals news from London Express Removals.',
  alternates: { canonical: '/blog' },
};

// SSR + revalidate so blogs stay fresh without rebuilds
export const revalidate = 300; // 5 minutes

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select('-content')
      .sort('-createdAt')
      .lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    console.error('Blog fetch error:', err.message);
    return [];
  }
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
});

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Moving tips & insights"
        subtitle="Practical advice from people who move Londoners every day."
      />

      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide">
          {blogs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-ink-100 p-12 text-center">
              <h2 className="font-display font-bold text-2xl mb-2">No posts yet</h2>
              <p className="text-ink-600">Check back soon — we're working on great content.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => (
                <Link
                  key={b._id}
                  href={`/blog/${b.slug}`}
                  className="group bg-white rounded-3xl border border-ink-100 overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all"
                >
                  {b.coverImage && (
                    <div className="aspect-video bg-ink-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-ink-500 mb-2">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {b.category}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(b.createdAt)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-lg mb-2 group-hover:text-ember-600 transition">{b.title}</h2>
                    {b.excerpt && <p className="text-ink-600 text-sm leading-relaxed mb-3 line-clamp-3">{b.excerpt}</p>}
                    <div className="inline-flex items-center gap-1 text-sm font-bold text-ember-600">
                      Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
