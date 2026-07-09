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

  // Hide the Next.js "N" dev indicator
  devIndicators: false,
};

export default nextConfig;
