import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/utils";

/** Layout for policy and informational pages with long-form prose. */
export function StaticPage({
  eyebrow,
  title,
  description,
  path,
  lastUpdated,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  path: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description}>
        <div className="mt-8">
          <Breadcrumbs items={[{ name: title, path }]} />
        </div>
      </PageHeader>
      <div className="container-page py-12">
        <div className="prose prose-lg prose-article mx-auto max-w-3xl dark:prose-invert">
          {lastUpdated && (
            <p className="text-sm text-muted">
              Last updated: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
            </p>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
