import path from "path";

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

let config = nextConfig;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withSerwistInit = require("@serwist/next").default;
  if (withSerwistInit) {
    const withSerwist = withSerwistInit({
      swSrc: "src/app/sw.ts",
      swDest: "public/sw.js",
      disable: process.env.NODE_ENV !== "production",
    });
    config = withSerwist(nextConfig);
  }
} catch {
  // Fallback to standard Next.js config if serwist build module is unavailable
  config = nextConfig;
}

export default config;
