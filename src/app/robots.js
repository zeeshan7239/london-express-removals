import { siteConfig } from '@/lib/utils/siteConfig';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/sign-in',
          '/sign-up',
          '/forgot-password',
          '/reset-password',
          '/admin',
          '/api/',
          '/dashboard',
          '/_next/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}