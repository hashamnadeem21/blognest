import { categories } from "@/lib/categories";
import { getArticleBySlug } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${siteConfig.name} article`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return renderOgImage({
    title: article?.title ?? siteConfig.name,
    eyebrow: article ? categories[article.category].name : "Article",
    footer: article ? `${article.readingTimeMinutes} min read · ${new URL(siteConfig.url).host}` : new URL(siteConfig.url).host,
  });
}
