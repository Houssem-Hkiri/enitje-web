/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
  // Add trailing slashes for better SEO
  trailingSlash: true,
  // Improve performance
  reactStrictMode: true,
  // Improve performance by skipping type checking in production
  typescript: {
    ignoreBuildErrors: true,
  },
  // Improve performance by skipping ESLint in production
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

