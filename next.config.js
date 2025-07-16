/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["media.graphassets.com", "via.placeholder.com"],
    unoptimized: true,
  },
  env: {
    HYGRAPH_ENDPOINT: process.env.HYGRAPH_ENDPOINT,
    HYGRAPH_TOKEN: process.env.HYGRAPH_TOKEN,
  },
}

module.exports = nextConfig
