import './globals.css';
import Providers from '@/components/common/Providers';
import { siteConfig } from '@/lib/utils/siteConfig';

// Note: In production with internet access, restore these next/font imports:
//   import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
//   const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
//   const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500','600','700','800'] });
// and add `className={\`\${inter.variable} \${jakarta.variable}\`}` to <html>.

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'man and van London', 'removals London', 'house removals UK',
    'office relocation London', 'flat moving', 'single item delivery',
    'student moves London', 'cheap removals London',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteConfig.url },
  verification: {
    // Add Google/Bing verification codes when you have them:
    // google: 'your-google-verification',
  },
};

export const viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
};

// LocalBusiness structured data — appears in every page, helps Google show
// you in the local pack with phone, hours, etc.
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: siteConfig.name,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  '@id': siteConfig.url,
  url: "https://londonexpressremovals.co.uk",
  telephone: siteConfig.phone,
  email: siteConfig.email,
  priceRange: '££',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London',
    addressRegion: 'England',
    addressCountry: 'GB',
  },
  areaServed: [
    { '@type': 'City', name: 'London' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
  openingHours: 'Mo-Sa 07:00-21:00, Su 09:00-18:00',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2400',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}