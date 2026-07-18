/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // ✅ Enable static export

  images: {
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3000',
      //   pathname: '/api/uploads/**',
      // },
      {
        protocol: 'https',
        hostname: 'www.mahandipurbalaji.com',
        pathname: '/api/uploads/**',
      },
      // Add production domain as needed
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',               // Redirect /admin to /admin/signin
        destination: '/admin/signin',
        permanent: true,                // 301 redirect (permanent)
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // trailingSlash: true,
};

module.exports = nextConfig;