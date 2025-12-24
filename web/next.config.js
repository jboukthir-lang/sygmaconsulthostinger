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
  // Remove standalone output mode which causes routes-manifest issues
  // output: 'standalone',

  // Ensure assets are loaded correctly from the web subdirectory on some Hostinger setups
  // If the assets still 404, we will uncomment the line below
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://sygmaconsult.com' : undefined,

  trailingSlash: true,
};

module.exports = nextConfig;
