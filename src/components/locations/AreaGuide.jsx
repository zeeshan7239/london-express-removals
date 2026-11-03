import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';
import { blogMatchQuery } from '@/lib/utils/locationLinks';

/**
 * "Moving to [Borough]? Read our area guide" — server component.
 * Lists published blog posts that match this location (by tag or slug).
 * Renders nothing if there are none or the database is unavailable.
 */
async function getPosts(slug) {
  const match = blogMatchQuery(slug);
  if (!match) return [];
  try {
    await connectDB();
    const posts = await Blog.find({ published: true, ...match })
      .select('title slug excerpt')
      .sort('-createdAt')
      .limit(3)
      .lean();
    return posts.map((p) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt || '' }));
  } catch (err) {
    console.error('Area guide fetch error:', err.message);
    return [];
  }
}

export default async function AreaGuide({ location }) {
  const posts = await getPosts(location.slug);
  if (!posts.length) return null;

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-wide max-w-4xl">
        <div className="flex items-center gap-2 mb-2 text-ember-600 text-sm font-bold uppercase tracking-wide">
          <BookOpen className="w-4 h-4" /> Area guide
        </div>
        <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-ink-900 mb-6">
          Moving to {location.name}? Read our area guide
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block rounded-2xl border-2 border-ink-100 p-5 hover:border-ember-500 transition"
            >
              <div className="font-display font-bold text-ink-900 mb-1 group-hover:text-ember-600">{p.title}</div>
              {p.excerpt ? <p className="text-sm text-ink-600 line-clamp-2">{p.excerpt}</p> : null}
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-ember-600">
                Read the guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
