import { List } from "lucide-react";
import type { TocItem } from "@/lib/content";
import { cn } from "@/lib/utils";

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.id} className={cn(item.depth === 3 && "pl-4")}>
          <a
            href={`#${item.id}`}
            className="block border-l-2 border-transparent pl-3 leading-snug text-muted transition-colors hover:border-brand hover:text-foreground"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Desktop: sticky sidebar list. Mobile: collapsible <details> (no JavaScript). */
export function TableOfContents({ items, variant }: { items: TocItem[]; variant: "sidebar" | "inline" }) {
  if (items.length < 2) return null;

  if (variant === "inline") {
    return (
      <details className="group mb-10 rounded-2xl border border-border bg-surface p-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
          <List className="h-4 w-4 text-link" aria-hidden />
          On this page
          <span className="ml-auto text-xs text-muted group-open:hidden">Show</span>
          <span className="ml-auto hidden text-xs text-muted group-open:inline">Hide</span>
        </summary>
        <nav aria-label="Table of contents" className="mt-4">
          <TocList items={items} />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-labelledby="toc-heading" className="rounded-2xl border border-border bg-surface p-5">
      <p id="toc-heading" className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <List className="h-4 w-4 text-link" aria-hidden /> On this page
      </p>
      <TocList items={items} />
    </nav>
  );
}
