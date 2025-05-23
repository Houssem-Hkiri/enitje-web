/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: [
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "tnzlhwdfznnipprzvpbm.supabase.co",
      "ibjdmfczfxusjovgjpbs.supabase.co",
      "supabase.co",
      "*.supabase.co",
      "*.supabase.in",
      "vercel-storage.com"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tnzlhwdfznnipprzvpbm.supabase.co',
        port: '',
        pathname: '/**',
      }
    ]
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
  // Handle Node.js built-in modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import node-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        http: false,
        https: false,
        stream: false,
        zlib: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

