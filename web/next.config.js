const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Add unoptimized for logos to ensure they load on Vercel
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Output mode standalone removed for Hostinger compatibility
  // output: 'standalone',

  trailingSlash: true,
  // Add generateBuildId to help with cache busting if needed
  generateBuildId: async () => {
    return 'sygma-build-' + Date.now();
  },
};

module.exports = nextConfig;
