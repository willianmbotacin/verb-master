import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const baseConfig: NextConfig = {
  reactStrictMode: true,
};

const devConfig: NextConfig = {
  ...baseConfig,
};

const prodConfig: NextConfig = {
  ...baseConfig,
  /** Use with `next dev --webpack` if file changes are not detected (e.g. some Windows setups). */
  webpack: (config, { dev }) => {
    if (dev && process.env.WATCHPACK_POLLING === "1") {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  register: true,
});

/**
 * PWA wraps webpack only for production builds. In development we skip it so
 * `next dev` can use Turbopack (default) with Fast Refresh / HMR without a
 * conflicting webpack config from the PWA plugin.
 */
export default process.env.NODE_ENV === "development"
  ? devConfig
  : withPWA(prodConfig);
