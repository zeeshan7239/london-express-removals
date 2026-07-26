import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';

/**
 * Blog listing page — server component.
 * Fetches published blogs directly from MongoDB at request time (SSR),
 * which means Google sees the full content on first crawl.
 *
 * If the DB has no posts yet (or is unreachable), we fall back to a hand-curated
 * list so the page is never empty. Once the admin publishes real posts, those
 * replace the fallback automatically.
 *
 * Cached for 5 minutes (revalidate = 300) — fresh content without rebuilding.
 */

export const revalidate = 300;

export const metadata = {
  title: 'Moving Tips & London Area Guides | London Express Removals Blog',
  description: 'Practical moving advice from London\'s trusted removal service. Packing tips, borough area guides, cost-saving checklists, and expert advice for stress-free moves across London.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Moving Tips & London Area Guides | London Express Removals Blog',
    description: 'Practical moving advice from London\'s trusted removal service — packing tips, area guides, cost-saving checklists and more.',
    url: '/blog',
  },
};


// Fallback blogs so the page is never empty before the admin adds any real posts.
// These match the SPA design with the gradient cover cards.
const FALLBACK_BLOGS = [
  {
    _id: 'fb-1', slug: 'how-to-prepare-for-a-london-move',
    title: 'How to prepare for a London move (a 7-day checklist)',
    excerpt: 'A practical, no-fluff checklist to make your London move easier — from the first box to the last.',
    category: 'Moving Tips', createdAt: '2024-09-12', readTime: '6 min read',
    coverGradient: 'from-ember-400 to-ember-600',
    coverImage:"https://burkeandwills.co.uk/wp-content/uploads/2023/09/burke_wills-265-scaled.jpg"
  },
  {
    _id: 'fb-2', slug: 'packing-fragile-items-the-right-way',
    title: 'Packing fragile items the right way',
    excerpt: 'Glass, ceramics, electronics — here\'s how the pros wrap them so nothing breaks in transit.',
    category: 'Packing', createdAt: '2024-08-28', readTime: '4 min read',
    coverGradient: 'from-sky-400 to-blue-600',
  },
  {
    _id: 'fb-3', slug: 'moving-to-zone-1-what-to-know',
    title: 'Moving to Zone 1: parking, permits and tight stairs',
    excerpt: 'Central London moves have unique challenges. Here\'s what to plan for before moving day.',
    category: 'London Areas', createdAt: '2024-08-15', readTime: '5 min read',
    coverGradient: 'from-violet-400 to-purple-600',
  },
  {
    _id: 'fb-4', slug: 'student-move-on-a-budget',
    title: 'How to do a student move without breaking the bank',
    excerpt: 'End-of-term move? Here\'s how to keep costs down without skimping on the essentials.',
    category: 'Guides', createdAt: '2024-08-02', readTime: '4 min read',
    coverGradient: 'from-emerald-400 to-teal-600',
  },
  {
    _id: 'fb-5', slug: 'office-move-without-downtime',
    title: 'How to plan an office move without losing a working day',
    excerpt: 'A weekend-friendly office move plan that lets your team start Monday in the new place.',
    category: 'Guides', createdAt: '2024-07-19', readTime: '7 min read',
    coverGradient: 'from-amber-400 to-orange-600',
  },
  {
    _id: 'fb-6', slug: 'when-to-book-your-mover',
    title: 'When is the best time to book your mover?',
    excerpt: 'Weekends, end of month, summer — here\'s how booking timing affects price and availability.',
    category: 'Moving Tips', createdAt: '2024-07-05', readTime: '3 min read',
    coverGradient: 'from-rose-400 to-pink-600',
  },
];

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
});

// Server-side fetch — runs on the server, no API roundtrip needed
async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select('-content')   // skip the body for the list view
      .sort('-createdAt')
      .lean();
    // .lean() returns plain JS objects; convert ObjectIds/Dates to strings so
    // they can be safely passed from server to client component (if any)
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    console.error('Blog list fetch error:', err.message);
    return [];
  }
}

export default async function BlogPage() {
  const fetched = await getBlogs();
  // Use real posts when available, otherwise fall back to the curated demo set
  const blogs = fetched.length > 0 ? fetched : FALLBACK_BLOGS;

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Moving Tips & London Area Guides London Express Removals Blog"
        subtitle="Practical moving advice from London's trusted man & van service — packing tips, area guides, cost-saving checklists and more."
      />

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b._id || b.slug}
                href={`/blog/${b.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-ink-200 hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                {/* Cover — uses gradient by default, real image if uploaded */}
                <div className={`aspect-[16/10] bg-gradient-to-br ${b.coverGradient || 'from-ember-400 to-ember-600'} relative`}>
                 {b.coverImage && (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={b.coverImage}
    alt={b.title}
    width={640}
    height={400}
    className="w-full h-full object-cover"
    loading="lazy"
  />
)}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider text-ink-900">
                      {b.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-ink-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.createdAt)}</span>
                    {b.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.readTime}</span>}
                  </div>
                  <h2 className="font-display font-bold text-lg leading-tight mb-3 group-hover:text-ember-600 transition">
                    {b.title}
                  </h2>
                  <p className="text-sm text-ink-600 leading-relaxed mb-4 flex-1">{b.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-900 group-hover:text-ember-600 transition">
                    Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
