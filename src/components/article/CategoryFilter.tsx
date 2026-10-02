import Link from "next/link";
import { categoryList, type CategorySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

/** Category filters as real, crawlable URLs (not query strings). */
export function CategoryFilter({ active, counts }: { active?: CategorySlug; counts: Record<string, number> }) {
  const items = [
    { href: "/blog", label: "All", slug: undefined as CategorySlug | undefined, count: undefined as number | undefined },
    ...categoryList.map((c) => ({ href: `/category/${c.slug}`, label: c.name, slug: c.slug, count: counts[c.slug] ?? 0 })),
  ];

  return (
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {items.map((item) => {
          const isActive = item.slug === active;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-transparent bg-gradient-to-r from-brand to-brand-2 text-white"
                    : "border-border bg-background text-muted hover:border-brand hover:text-foreground",
                )}
              >
                {item.label}
                {item.count !== undefined && (
                  <span className={cn("text-xs", isActive ? "text-white/80" : "text-muted")}>{item.count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
