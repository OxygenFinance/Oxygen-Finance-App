/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["avatars.dicebear.com", "api.dicebear.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
}

module.exports = nextConfig
