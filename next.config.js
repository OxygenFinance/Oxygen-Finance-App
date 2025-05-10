/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com", "v0.blob.com"],
    unoptimized: true,
  },
  // Ensure we're not using experimental features that might cause issues
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        module: false,
      }
    }

    return config
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Added the requested configuration options
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
