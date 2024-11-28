import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/predict', // Only the path you want to rewrite
        destination: 'http://ec2-18-192-24-192.eu-central-1.compute.amazonaws.com:3030', // Full URL where the request will be forwarded
      },
    ];
  },
};

export default nextConfig;
