/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.veloci.online' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
    ],
  },
};

module.exports = nextConfig;
