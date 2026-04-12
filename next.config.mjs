/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static page generation for problematic pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
