import { Fragment } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Reveal } from "@/components/ui/Reveal";
import type { ArticleSummary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";

/**
 * Responsive card grid. Optionally inserts one clearly separated listing ad
 * after `adAfter` cards — never between a card's image and its title.
 */
export function ArticleGrid({
  articles,
  columns = 3,
  adAfter,
  priorityCount = 0,
  headingLevel = 3,
}: {
  articles: ArticleSummary[];
  columns?: 2 | 3;
  adAfter?: number;
  priorityCount?: number;
  headingLevel?: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:gap-8",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
      )}
    >
      {articles.map((article, i) => (
        <Fragment key={article.slug}>
          <Reveal as="li" delay={Math.min(i % 3, 2) * 0.06}>
            <ArticleCard article={article} priority={i < priorityCount} headingLevel={headingLevel} />
          </Reveal>
          {adAfter !== undefined && i === adAfter - 1 && articles.length > adAfter && (
            <li className="sm:col-span-2 lg:col-span-full">
              <AdSlot placement="listing" className="my-2" />
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
