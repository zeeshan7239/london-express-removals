/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Allow all HTTPS image sources (covers Cloudinary, getAddress, any CDN)
      { protocol: 'https', hostname: '**' },
      // Cloudinary explicit (belt-and-braces)
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // Old / alternative location URLs -> the one real page (no duplicate pages).
  // Keep in sync with LOCATION_ALIASES in src/lib/utils/locationLinks.js.
  async redirects() {
    const aliases = {
      'newham': 'stratford',
      'waltham-forest': 'walthamstow',
      'fulham': 'hammersmith',
      'hammersmith-and-fulham': 'hammersmith',
      'merton': 'wimbledon',
      'hillingdon': 'uxbridge',
      'redbridge': 'ilford',
      'havering': 'romford',
      'barking-and-dagenham': 'barking',
      'dagenham': 'barking',
      'kingston-upon-thames': 'kingston',
      'richmond-upon-thames': 'richmond',
      'city-of-westminster': 'westminster',
      'kensington-and-chelsea': 'kensington',
      'royal-borough-of-greenwich': 'greenwich',
    };
    return Object.entries(aliases).map(([from, to]) => ({
      source: `/locations/${from}`,
      destination: `/locations/${to}`,
      permanent: true,
    }));
  },

  // Hide the Next.js "N" dev indicator
  devIndicators: false,
};

export default nextConfig;
