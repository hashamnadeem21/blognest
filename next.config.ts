import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // MDX files are read from disk at build/revalidation time, make sure they
  // are traced into the serverless bundle on Vercel.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your CDN / CMS image hosts here when you move away from local images.
    remotePatterns: [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    // Avoid duplicate URLs: page 1 of any paginated listing lives at the base URL.
    return [
      { source: "/blog/page/1", destination: "/blog", permanent: true },
      { source: "/category/:category/page/1", destination: "/category/:category", permanent: true },
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/feed.xml", destination: "/rss.xml", permanent: true },
    ];
  },
};

export default nextConfig;
