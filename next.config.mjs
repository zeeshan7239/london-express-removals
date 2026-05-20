/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Hide the "N" Next.js dev tools indicator in the bottom-left during development.
  // This indicator never appears in production builds — disabling here is purely cosmetic.
  devIndicators: false,
};

export default nextConfig;
