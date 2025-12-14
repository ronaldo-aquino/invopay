/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    const webpack = require("webpack");
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/test\//,
        contextRegExp: /thread-stream$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/LICENSE$/,
        contextRegExp: /thread-stream$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/bench\.js$/,
        contextRegExp: /thread-stream$/,
      })
    );

    return config;
  },
  turbopack: {},
  serverExternalPackages: ["pino", "thread-stream"],
  outputFileTracingExcludes: {
    "*": [
      "node_modules/thread-stream/test/**/*",
      "node_modules/thread-stream/LICENSE",
      "node_modules/thread-stream/bench.js",
    ],
  },
};

module.exports = nextConfig;
