/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remotePatterns = [];
if (supabaseUrl) {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    remotePatterns.push({
      protocol: 'https',
      hostname,
      pathname: '/storage/v1/object/public/**',
    });
  } catch {}
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'img.youtube.com'],
    remotePatterns,
    unoptimized: process.env.NODE_ENV === 'development',
  },
  output: 'standalone',
  // Each per-client server (one port per site) needs its own build directory.
  // Two `next dev` processes sharing one .next overwrite each other's compiled
  // output, which surfaces as "__webpack_modules__[moduleId] is not a function".
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

module.exports = nextConfig;
