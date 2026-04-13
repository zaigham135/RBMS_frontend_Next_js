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
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Proxy all /api/* and /oauth2/* calls through Vercel to avoid mixed content
  // Browser calls https://vercel-app/api/... → Vercel server calls http://aws-backend/api/...
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
