import { ArticleGrid } from "@/components/article/ArticleGrid";
import { CategoryFilter } from "@/components/article/CategoryFilter";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { PageHeader } from "@/components/ui/SectionHeading";
import type { CategorySlug } from "@/lib/categories";
import type { ArticleSummary, Page } from "@/lib/content";
import type { Crumb } from "@/lib/jsonld";
import { collectionPageJsonLd } from "@/lib/jsonld";

interface Props {
  title: string;
  description: string;
  eyebrow: string;
  basePath: string;
  result: Page<ArticleSummary>;
  counts: Record<string, number>;
  activeCategory?: CategorySlug;
  crumbs: Crumb[];
}

export function BlogListing({ title, description, eyebrow, basePath, result, counts, activeCategory, crumbs }: Props) {
  const path = result.page > 1 ? `${basePath}/page/${result.page}` : basePath;
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description}>
        <div className="mt-8">
          <Breadcrumbs items={crumbs} />
        </div>
      </PageHeader>
      <div className="container-page py-12">
        <div className="mb-10">
          <CategoryFilter active={activeCategory} counts={counts} />
        </div>
        {result.items.length > 0 ? (
          <ArticleGrid articles={result.items} adAfter={3} priorityCount={result.page === 1 ? 3 : 0} headingLevel={2} />
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-12 text-center text-muted">
            No articles here yet — check back soon.
          </p>
        )}
        <Pagination basePath={basePath} page={result.page} totalPages={result.totalPages} />
        <p className="mt-6 text-center text-sm text-muted">
          Showing page {result.page} of {result.totalPages} · {result.totalItems} articles
        </p>
      </div>
      <JsonLd data={collectionPageJsonLd(title, description, path)} />
    </>
  );
}
