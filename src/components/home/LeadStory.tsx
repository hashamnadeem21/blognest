import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleMetaLine, CategoryBadge } from "@/components/article/ArticleCard";
import type { ArticleSummary } from "@/lib/content";

/** Large featured story used at the top of the homepage. */
export function LeadStory({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-navy text-white shadow-2xl shadow-indigo-900/20">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/11]">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/55 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Featured
          </span>
          <CategoryBadge slug={article.category} className="bg-white/90 text-indigo-700" />
        </div>
        <h2 className="max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 hidden max-w-xl text-base leading-relaxed text-white/80 sm:block">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <ArticleMetaLine article={article} className="text-white/75" />
          <span
            aria-hidden
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-700 transition-transform group-hover:rotate-45 sm:inline-flex"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </article>
  );
}
