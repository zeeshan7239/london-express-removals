import { siteConfig } from '@/lib/utils/siteConfig';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/admin', '/api'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
