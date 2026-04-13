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
  // Proxy API calls through Next.js to avoid mixed content (http backend from https frontend)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/oauth2/:path*`,
      },
      {
        source: '/login/oauth2/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/login/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
