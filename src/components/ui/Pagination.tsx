import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { pageHref } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Crawlable pagination with real <a href> links (no JS required). */
export function Pagination({ basePath, page, totalPages }: { basePath: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(basePath, page - 1)} rel="prev" className={cn(linkBase, "border-border hover:border-brand")}>
          <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
        </Link>
      ) : null}
      <ol className="flex items-center gap-2">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={pageHref(basePath, p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                linkBase,
                p === page
                  ? "border-transparent bg-gradient-to-r from-brand to-brand-2 text-white"
                  : "border-border hover:border-brand",
              )}
            >
              {p}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={pageHref(basePath, page + 1)} rel="next" className={cn(linkBase, "border-border hover:border-brand")}>
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
