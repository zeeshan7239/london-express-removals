/**
 * Generic metadata helper for page-level SEO.
 * Server components: export `export const metadata = { ... }` directly.
 * Use this helper to build consistent metadata objects:
 *
 *   export const metadata = buildMetadata({
 *     title: 'About us',
 *     description: '...',
 *     path: '/about',
 *   });
 */
import { siteConfig } from '@/lib/utils/siteConfig';

export const buildMetadata = ({ title, description, path = '', image }) => {
  const fullUrl = `${siteConfig.url}${path}`;
  return {
    title,
    description: description || siteConfig.description,
    alternates: { canonical: fullUrl },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url: fullUrl,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
    },
  };
};
