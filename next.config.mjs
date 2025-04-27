/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  // Disable strict mode for Socket.io to work well
  webpack: (config) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });
    return config;
  },
};

export default nextConfig;
