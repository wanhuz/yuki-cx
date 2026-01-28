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
        {
        protocol: 'https',
        hostname: 'assets.fanart.tv',
      },
    ],
  },


};

export default nextConfig;
