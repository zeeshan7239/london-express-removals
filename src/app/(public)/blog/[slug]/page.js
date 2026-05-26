import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';
import CTABanner from '@/components/home/CTABanner';
import ShareButton from '@/components/common/ShareButton';
import { siteConfig } from '@/lib/utils/siteConfig';

/**
 * Single blog post — server-side rendered for full SEO.
 *
 * If the slug doesn't match a real post, we check the FALLBACK_POSTS map below
 * so the demo content from the SPA still works (links from the listing page
 * won't 404 before the admin publishes real content).
 */

export const revalidate = 300;

// Fallback content keyed by slug — matches the listing page's fallback blogs.
const FALLBACK_POSTS = {
  'how-to-prepare-for-a-london-move': {
    title: 'How to prepare for a London move (a 7-day checklist)',
    category: 'Moving Tips',
    createdAt: '2024-09-12',
    readTime: '6 min read',
    coverGradient: 'from-ember-400 to-ember-600',
    excerpt: 'A practical, no-fluff checklist to make your London move easier — from the first box to the last.',
    author: { name: 'London Express Removals' },
    content: `
<p>Moving in London is rarely a quiet weekend project. Between parking restrictions, narrow stairs, weekday traffic, and the sheer volume of stuff most of us own, even a small move can spiral into a stressful day.</p>
<h2>Start two weeks before</h2>
<p>The best moves start with a clear plan. Two weeks before your move date, list every room and what's in it. You'll quickly see which rooms need packing first (storage, spare bedrooms) and which can wait (kitchen, bathroom).</p>
<p>Order boxes early — most stationery shops and removal companies will deliver them. We supply free boxes with every booking over £200.</p>
<h2>Declutter ruthlessly</h2>
<p>If you haven't used something in 12 months, you probably don't need to move it. Charity shops collect, and waste removal services like ours can clear larger items the same day.</p>
<h2>Pack room-by-room, label everything</h2>
<p>Mixing rooms in the same box guarantees chaos at the other end. Pack one room at a time, label every box with the room name (not the contents — burglars love that), and keep an "essentials" box separately for the first night.</p>
<h2>Book early for weekends</h2>
<p>Saturday slots fill up 2-3 weeks in advance, especially end-of-month. Midweek moves are typically 15-20% cheaper if your job allows it.</p>
`,
  },
  'packing-fragile-items-the-right-way': {
    title: 'Packing fragile items the right way',
    category: 'Packing',
    createdAt: '2024-08-28',
    readTime: '4 min read',
    coverGradient: 'from-sky-400 to-blue-600',
    excerpt: 'Glass, ceramics, electronics — here\'s how the pros wrap them so nothing breaks in transit.',
    author: { name: 'London Express Removals' },
    content: `
<p>Fragile items don't break in transit because they're delicate — they break because of poor packing. Here's how to do it the way removal teams do.</p>
<h2>The right materials</h2>
<p>You need three things: bubble wrap (not newspaper — ink transfers), packing paper for filling gaps, and double-walled boxes (single-wall flex too much).</p>
<h2>Glasses and stemware</h2>
<p>Stuff paper inside the bowl of each glass, then wrap individually in bubble wrap. Pack vertically (rim down) in a divided box. Never stack horizontally.</p>
<h2>Plates</h2>
<p>Always pack vertically — never flat. Layer paper between each plate, then bubble-wrap groups of 4-5. Boxes should be no more than 60% full to avoid crushing.</p>
<h2>Electronics</h2>
<p>If you have the original packaging, use it. If not, wrap screens in soft cloth first (microfibre, never bubble wrap directly on glass), then bubble wrap, then a box with paper fill.</p>
<h2>Label clearly</h2>
<p>"FRAGILE" on all six sides and "THIS WAY UP" with arrows. Your movers can't read minds.</p>
`,
  },
  'moving-to-zone-1-what-to-know': {
    title: 'Moving to Zone 1: parking, permits and tight stairs',
    category: 'London Areas',
    createdAt: '2024-08-15',
    readTime: '5 min read',
    coverGradient: 'from-violet-400 to-purple-600',
    excerpt: 'Central London moves have unique challenges. Here\'s what to plan for before moving day.',
    author: { name: 'London Express Removals' },
    content: `
<p>Moving into central London — Zones 1 and 2 — comes with hurdles you won't face elsewhere in the UK. Plan for these before booking your van.</p>
<h2>Parking permits and suspensions</h2>
<p>Many central London streets require a parking bay suspension to park a removal van. Apply at least 10 working days in advance through your borough's website. Westminster, Camden, Islington and Hackney all have online forms.</p>
<h2>Loading bay availability</h2>
<p>Some buildings have dedicated loading bays — check with your building manager. Without one, expect to park 30-50m from the front door, which adds time to the move.</p>
<h2>Lift access</h2>
<p>Old Victorian mansion blocks often have small lifts that won't fit a sofa. Measure your largest item before booking; you may need stairs-only pricing.</p>
<h2>Stair carry surcharges</h2>
<p>Walk-ups in Bloomsbury and Pimlico can be 4-5 floors with no lift. Most companies charge extra for this — we'll show the surcharge transparently on the booking page.</p>
`,
  },
  'student-move-on-a-budget': {
    title: 'How to do a student move without breaking the bank',
    category: 'Guides',
    createdAt: '2024-08-02',
    readTime: '4 min read',
    coverGradient: 'from-emerald-400 to-teal-600',
    excerpt: 'End-of-term move? Here\'s how to keep costs down without skimping on the essentials.',
    author: { name: 'London Express Removals' },
    content: `
<p>Student moves don't need to cost a fortune. Here's how to keep yours under £150 in London.</p>
<h2>Use a single-driver van</h2>
<p>For a single-room move with no heavy furniture, you don't need two movers. A driver-help service is typically £100-£130 and they'll help load and unload.</p>
<h2>Move midweek</h2>
<p>Saturdays are 20% more expensive on average. If your timetable allows, book a Tuesday or Wednesday.</p>
<h2>Pack everything before the van arrives</h2>
<p>The clock starts when the team arrives. Every minute they spend waiting for you to finish packing is a minute on the bill. Have everything ready in the corridor.</p>
<h2>Share a van with a flatmate</h2>
<p>If you're moving to the same area, splitting a van between two people effectively halves the cost.</p>
`,
  },
  'office-move-without-downtime': {
    title: 'How to plan an office move without losing a working day',
    category: 'Guides',
    createdAt: '2024-07-19',
    readTime: '7 min read',
    coverGradient: 'from-amber-400 to-orange-600',
    excerpt: 'A weekend-friendly office move plan that lets your team start Monday in the new place.',
    author: { name: 'London Express Removals' },
    content: `
<p>The best office moves happen on a Friday evening and finish by Sunday afternoon. Here's how to structure that.</p>
<h2>Friday 5pm — staff go home</h2>
<p>Computers stay on desks. The team should pack their personal items into a labelled crate before leaving and take it home with them — laptops, monitors, paperwork.</p>
<h2>Friday 6pm — movers arrive</h2>
<p>Desks, chairs, monitors (carefully labelled), and IT equipment go first. Cable up monitors with their host machines using labels — your IT team will thank you.</p>
<h2>Saturday — setup at new office</h2>
<p>Furniture is positioned, desks placed, IT reconnected. A good moving team can do this in a single day for a 30-person office.</p>
<h2>Sunday — IT testing</h2>
<p>Have your IT team in to verify connectivity, printers, phones. Catch the small things before Monday morning.</p>
<h2>Monday — work starts as normal</h2>
<p>Staff arrive to a working desk and a fresh coffee. No "we'll be up by Wednesday" excuses.</p>
`,
  },
  'when-to-book-your-mover': {
    title: 'When is the best time to book your mover?',
    category: 'Moving Tips',
    createdAt: '2024-07-05',
    readTime: '3 min read',
    coverGradient: 'from-rose-400 to-pink-600',
    excerpt: 'Weekends, end of month, summer — here\'s how booking timing affects price and availability.',
    author: { name: 'London Express Removals' },
    content: `
<p>Booking timing is one of the biggest factors in your moving cost. Here's the cheat sheet.</p>
<h2>Cheapest: midweek, mid-month, winter</h2>
<p>A Tuesday or Wednesday move in the middle of January is the cheapest you'll find. Demand is low and movers compete for your booking.</p>
<h2>Most expensive: end of month, weekends, summer</h2>
<p>The last Saturday of any month is the worst — tenancies typically end on the last day, so everyone moves at once. Add 25-35% to your usual rate.</p>
<h2>Book 2-3 weeks ahead for weekends</h2>
<p>Weekend slots fill fast. If your move is on a Friday or Saturday, book at least 2 weeks ahead. Sunday is slightly cheaper and easier to book.</p>
<h2>Last-minute? Try Sunday or Monday</h2>
<p>Same-day or next-day moves are easier to find on Sundays and Mondays. Avoid Saturdays for last-minute bookings.</p>
`,
  },
};

async function getBlog(slug) {
  // Try MongoDB first
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
  // Fall back to demo content if available
  return FALLBACK_POSTS[slug] || null;
}

// Per-post SEO metadata — different title, description, OG tags per slug
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

  // Article structured data for SEO — gets rich results in Google
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
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

      {/* Hero — gradient background from the SPA design */}
      <section className={`relative bg-gradient-to-br ${blog.coverGradient || 'from-ink-900 to-ink-800'} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.coverImage} alt={blog.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="container-wide relative py-20 lg:py-28 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-wider mb-6">
            {blog.category}
          </span>
          <h1 className="heading-display !text-white text-3xl md:text-5xl leading-tight mb-6">
            {blog.title}
          </h1>
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
        </div>
      </section>

      {/* Article body — rendered server-side, gets indexed properly */}
      <article className="py-20">
        <div className="container-wide max-w-3xl">
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-p:text-ink-700 prose-p:leading-relaxed prose-a:text-ember-600 prose-strong:text-ink-900"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share — the only client-side bit */}
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
