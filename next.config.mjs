/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mei.kuudere.pw',
      },
      {
        protocol: 'https',
        hostname: 'artworks.thetvdb.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
