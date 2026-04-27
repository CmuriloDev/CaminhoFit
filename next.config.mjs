/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.107.90'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zuozzznvrtejckvmjtgc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;