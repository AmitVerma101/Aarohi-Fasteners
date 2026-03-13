/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = new URL('./canvas-noop.js', import.meta.url).pathname;
    return config;
  },
};

export default nextConfig;
