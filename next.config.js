const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  images: {
    domains: ['assets.coingecko.com', 'cryptologos.cc'],
  },
}

module.exports = nextConfig
