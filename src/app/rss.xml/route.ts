import { categories } from "@/lib/categories";
import { getAuthors, getLatestArticles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

export async function GET() {
  const [articles, authors] = await Promise.all([getLatestArticles(30), getAuthors()]);
  const authorName = new Map(authors.map((a) => [a.slug, a.name]));
  const lastBuild = articles[0]?.updatedAt ?? articles[0]?.publishedAt ?? new Date().toISOString();

  const items = articles
    .map((a) => {
      const url = absoluteUrl(`/blog/${a.slug}`);
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(categories[a.category].name)}</category>
      <dc:creator>${escapeXml(authorName.get(a.author) ?? siteConfig.name)}</dc:creator>
      <enclosure url="${absoluteUrl(`/blog/${a.slug}/opengraph-image`)}" type="image/png" length="0" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <image>
      <url>${absoluteUrl("/logo.png")}</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${absoluteUrl("/")}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
