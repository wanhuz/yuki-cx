/** @type {import('next').NextConfig} */
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const handlerPath = require.resolve(
  "next/dist/server/lib/incremental-cache/file-system-cache.js"
);


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
    minimumCacheTTL: 2678400, // 31 days
  },
  cacheHandler: handlerPath,

};

export default nextConfig;
