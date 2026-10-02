import { publicEnv } from "@/lib/env";

export const siteConfig = {
  name: "BlogNest",
  shortName: "BlogNest",
  tagline: "Clear thinking on technology, AI, and a well-lived life.",
  description:
    "BlogNest publishes practical, carefully edited guides on technology, AI tools, productivity, travel, lifestyle, and personal development.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  language: "en",
  contactEmail: publicEnv.NEXT_PUBLIC_CONTACT_EMAIL,
  /** Number of articles per listing page (blog, categories). */
  pageSize: 6,
  /** ISR window for content pages, in seconds. */
  revalidateSeconds: 3600,
  social: {
    // Leave blank until real profiles exist — empty values are not rendered.
    x: "",
    linkedin: "",
    github: "",
  },
  nav: [
    { href: "/blog", label: "Blog" },
    { href: "/latest", label: "Latest" },
    { href: "/trending", label: "Trending" },
    { href: "/category/technology", label: "Technology" },
    { href: "/category/ai", label: "AI" },
    { href: "/about", label: "About" },
  ],
  footer: {
    explore: [
      { href: "/blog", label: "All articles" },
      { href: "/latest", label: "Latest" },
      { href: "/trending", label: "Trending" },
      { href: "/search", label: "Search" },
      { href: "/rss.xml", label: "RSS feed" },
    ],
    company: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/editorial-policy", label: "Editorial policy" },
      { href: "/corrections-policy", label: "Corrections policy" },
    ],
    legal: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/advertising-disclosure", label: "Advertising disclosure" },
    ],
  },
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
