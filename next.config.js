const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  images: {
    domains: ['assets.coingecko.com', 'cryptologos.cc'],
    // Image optimization is disabled for static export.
    unoptimized: true,
  },
  // Generate a static export suitable for GitHub Pages.
  output: 'export',
  trailingSlash: true,
  // Configure the base path and asset prefix to match the repo name.
  basePath: '/crypto-intelligence-platform',
  assetPrefix: '/crypto-intelligence-platform/',
};

module.exports = nextConfig;
