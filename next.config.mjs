/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.dicebear.com', 'assets.mixkit.co'],
    unoptimized: true,
  },
  // Ensure environment variables are properly loaded
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
