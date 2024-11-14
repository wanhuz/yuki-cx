/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['mei.kuudere.pw'], // Add the external domain here
    },
    async redirects() {
      return [
        {
          // this will match `/english(default)/something` being requested
          source: '/',
          destination: '/search',
          permanent: false
        },
      ]
    },
  };


export default nextConfig;