/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images configuration
  images: {
    domains: ['api.dicebear.com', 'assets.mixkit.co', 'pbs.twimg.com'],
    unoptimized: true,
  },
  // Experimental features
  experimental: {
    serverActions: true,
  },
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || "supersecret",
  },
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
