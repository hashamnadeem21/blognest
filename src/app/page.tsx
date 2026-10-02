import { Flame, Hash, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, ArticleMetaLine } from "@/components/article/ArticleCard";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LeadStory } from "@/components/home/LeadStory";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getCategoryCounts,
  getEditorsPicks,
  getFeaturedArticles,
  getLatestArticles,
  getTopicTags,
  getTrendingArticles,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { humanizeTag } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Practical guides to technology, AI, and living well`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [featured, latest, trending, picks, topics, counts] = await Promise.all([
    getFeaturedArticles(3),
    getLatestArticles(9),
    getTrendingArticles(5),
    getEditorsPicks(4),
    getTopicTags(10),
    getCategoryCounts(),
  ]);
  const [lead, ...secondary] = featured;
  const featuredSlugs = new Set(featured.map((a) => a.slug));
  const latestRest = latest.filter((a) => !featuredSlugs.has(a.slug)).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-32 top-20 h-[24rem] w-[24rem] rounded-full bg-brand-2/20 blur-3xl" />
        </div>
        <div className="container-page pb-16 pt-10 sm:pt-14 lg:pb-20">
          <div>
            <div className="animate-rise" style={{ animationDelay: "0ms" }}>
              <p className="eyebrow inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Independent · Practical · Carefully edited
              </p>
            </div>
            <div className="animate-rise" style={{ animationDelay: "80ms" }}>
              <h1 className="mt-4 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Clear thinking on <span className="text-gradient">technology, AI</span> and a well-lived life.
              </h1>
            </div>
            <div className="animate-rise" style={{ animationDelay: "160ms" }}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                In-depth guides and explainers you can actually use — researched, edited, and kept up to date by the
                BlogNest editorial team.
              </p>
            </div>
          </div>

          {lead && (
            <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
              <LeadStory article={lead} />
              <div className="grid gap-6">
                {secondary.map((article) => (
                  <ArticleCard key={article.slug} article={article} headingLevel={2} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trending topics */}
      {topics.length > 0 && (
        <section aria-labelledby="topics-heading" className="border-y border-border bg-surface">
          <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <h2 id="topics-heading" className="flex shrink-0 items-center gap-2 text-sm font-semibold">
              <Hash className="h-4 w-4 text-link" aria-hidden /> Topics we&apos;re covering
            </h2>
            <ul className="flex flex-wrap gap-2">
              {topics.map(({ tag }) => (
                <li key={tag}>
                  <Link
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="inline-block rounded-full border border-border bg-background px-3 py-1.5 text-sm capitalize text-muted transition-colors hover:border-brand hover:text-link"
                  >
                    {humanizeTag(tag)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest */}
      <section aria-labelledby="latest-heading" className="container-page py-20">
        <SectionHeading
          id="latest-heading"
          eyebrow="Fresh off the press"
          title="Latest articles"
          description="Our newest guides and explainers, most recent first."
          href="/latest"
          linkLabel="All latest articles"
        />
        <ArticleGrid articles={latestRest} adAfter={3} />
      </section>

      {/* Trending + Editor's picks */}
      <section className="container-page grid gap-12 pb-20 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div>
          <SectionHeading
            id="trending-heading"
            eyebrow="Editor-curated"
            title={
              <span className="inline-flex items-center gap-2">
                Trending now <Flame className="h-7 w-7 text-orange-500" aria-hidden />
              </span>
            }
            href="/trending"
          />
          <ol className="space-y-1">
            {trending.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={i * 0.04}>
                <div className="group relative flex gap-5 rounded-2xl p-4 transition-colors hover:bg-surface">
                  <span className="font-display text-4xl font-semibold text-gradient tabular-nums" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-link">
                        {article.title}
                      </Link>
                    </h3>
                    <ArticleMetaLine article={article} className="mt-1.5" />
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <SectionHeading
            id="picks-heading"
            eyebrow="Handpicked"
            title="Editor's picks"
            description="Guides our editors recommend starting with."
          />
          <ul className="grid gap-6">
            {picks.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={i * 0.05}>
                <ArticleCard article={article} variant="horizontal" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading
            id="categories-heading"
            eyebrow="Explore"
            title="Browse by category"
            description="Find guides on the topics you care about most."
            href="/blog"
            linkLabel="All articles"
          />
          <CategoryGrid counts={counts} />
        </div>
      </section>

      <div className="pt-20">
        <NewsletterBand />
      </div>
    </>
  );
}
