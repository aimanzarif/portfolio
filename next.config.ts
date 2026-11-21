import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

/*
 * Caching. HTML is never cached: every page carries a per-request CSP nonce, and a cached copy
 * would hand the same nonce to everyone. Hashed /_next/static files are already cached for a year
 * by Next.js itself. Below: files whose names don't change when their content does, so they get
 * moderate lifetimes plus stale-while-revalidate (served instantly, refreshed in the background).
 */
const cache = (seconds: number, staleSeconds: number) => [
  { key: "Cache-Control", value: `public, max-age=${seconds}, stale-while-revalidate=${staleSeconds}` },
];

const DAY = 86_400;

const nextConfig: NextConfig = {
  images: {
    // Optimised images (/_next/image) are kept for 30 days instead of the 4-hour default.
    minimumCacheTTL: 30 * DAY,
  },
  output: "standalone",
  allowedDevOrigins: ["192.168.0.28", "127.0.0.1"],
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Project screenshots and photos: change rarely.
      { source: "/projects/:path*", headers: cache(7 * DAY, 30 * DAY) },
      { source: "/:file(.*\\.(?:png|jpg|jpeg|webp|svg))", headers: cache(7 * DAY, 30 * DAY) },
      // CV and sample report: short, so a new CV shows up within the hour.
      { source: "/docs/:path*", headers: cache(3600, DAY) },
      // Icons and link-preview image are generated at build time.
      { source: "/icon.svg", headers: cache(DAY, 7 * DAY) },
      { source: "/favicon.ico", headers: cache(DAY, 7 * DAY) },
      { source: "/apple-icon", headers: cache(DAY, 7 * DAY) },
      { source: "/opengraph-image", headers: cache(DAY, 7 * DAY) },
      { source: "/robots.txt", headers: cache(DAY, 7 * DAY) },
      { source: "/sitemap.xml", headers: cache(DAY, 7 * DAY) },
    ];
  },
};

export default nextConfig;
