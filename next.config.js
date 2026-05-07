/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true,   // 🔥 VERY IMPORTANT
  },
};

module.exports = nextConfig;