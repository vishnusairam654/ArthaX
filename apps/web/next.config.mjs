/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@arthax/tokens', '@arthax/types', '@arthax/validation'],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
