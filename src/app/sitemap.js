import { siteConfig } from '@/lib/utils/siteConfig';
import { connectDB } from '@/lib/db/connect';
import Blog from '@/lib/models/Blog';

export default async function sitemap() {
  const base = [
    { url: siteConfig.url, lastModified: new Date(), priority: 1.0 },
    { url: `${siteConfig.url}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteConfig.url}/services`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteConfig.url}/booking`, lastModified: new Date(), priority: 1.0 },
    { url: `${siteConfig.url}/custom-quote`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${siteConfig.url}/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, lastModified: new Date(), priority: 0.3 },
  ];

  // Add blog posts dynamically. If DB is unreachable, just return base routes.
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select('slug updatedAt')
      .sort('-updatedAt')
      .lean();
    blogs.forEach((b) => {
      base.push({
        url: `${siteConfig.url}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        priority: 0.6,
      });
    });
  } catch {
    // Sitemap should never fail the build — degrade gracefully
  }

  return base;
}
