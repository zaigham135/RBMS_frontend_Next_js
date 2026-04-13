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
  // Increase body size limit for file uploads proxied through Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Proxy API calls through Next.js server to avoid mixed content
  // Browser calls https://vercel-app/api/* → Next.js server calls http://aws-backend/api/*
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${backendUrl}/oauth2/:path*`,
      },
      {
        source: '/login/oauth2/:path*',
        destination: `${backendUrl}/login/oauth2/:path*`,
      },
      {
        source: '/actuator/:path*',
        destination: `${backendUrl}/actuator/:path*`,
      },
    ];
  },
};

export default nextConfig;
