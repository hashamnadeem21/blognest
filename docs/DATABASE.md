# Moving content to PostgreSQL and adding an admin dashboard

The site never reads files directly. Every page goes through this chain:

```
pages/components → src/lib/content/index.ts (service layer: visibility, sorting, related, search)
                 → ContentRepository interface (src/lib/content/repository.ts)
                 → MdxContentRepository (today)  |  PostgresContentRepository (later)
```

That means you can add a database and an admin UI without rebuilding pages.

## 1. Schema

A suggested starting schema (adapt to Drizzle, Prisma, or SQL migrations):

```sql
create table authors (
  slug        text primary key,
  name        text not null,
  type        text not null default 'Person' check (type in ('Person','Organization')),
  role        text not null,
  bio         text not null,
  avatar      text not null,
  links       jsonb not null default '{}'
);

create table articles (
  slug             text primary key,
  title            text not null,
  excerpt          text not null,
  category         text not null,
  tags             text[] not null default '{}',
  author           text not null references authors(slug),
  published_at     timestamptz not null,
  updated_at       timestamptz,
  status           text not null default 'draft' check (status in ('draft','published')),
  featured         boolean not null default false,
  trending         boolean not null default false,
  editors_pick     boolean not null default false,
  cover_image      text not null,
  cover_alt        text not null,
  cover_width      int not null default 1600,
  cover_height     int not null default 900,
  seo_title        text,
  seo_description  text,
  canonical_url    text,
  noindex          boolean not null default false,
  ads              boolean not null default true,
  body             text not null,             -- MDX or Markdown
  created_at       timestamptz not null default now()
);

create index articles_published_idx on articles (status, published_at desc);
create index articles_category_idx on articles (category);
```

## 2. Implement the repository

```ts
// src/lib/content/postgres-repository.ts
import "server-only";
import readingTime from "reading-time";
import type { ContentRepository } from "./repository";
import { articleFrontmatterSchema, authorSchema, type Article } from "./schema";
import { extractToc } from "./toc";

export class PostgresContentRepository implements ContentRepository {
  async listArticles(): Promise<Article[]> {
    const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt));
    return rows.map(toArticle);
  }
  // getArticle, listAuthors, getAuthor …
}

function toArticle(row: Row): Article {
  // Validate with the SAME schema the MDX files use.
  const data = articleFrontmatterSchema.parse({ /* map snake_case columns to camelCase fields */ });
  const stats = readingTime(row.body);
  return { ...data, slug: row.slug, content: row.body, toc: extractToc(row.body),
           wordCount: stats.words, readingTimeMinutes: Math.max(1, Math.round(stats.minutes)) };
}
```

Then switch the source in `getRepository()` (`src/lib/content/index.ts`), for example with a `CONTENT_SOURCE=postgres` environment variable. For large sites, add filtered queries (by category, paginated) to the repository and use them from the service layer instead of filtering in memory.

## 3. Keep pages fresh

Pages use time-based ISR (`revalidate = 3600`). With a database, revalidate on publish instead of waiting:

```ts
"use server";
import { revalidatePath } from "next/cache";

export async function publishArticle(slug: string) {
  await requireAdmin();                 // see below
  await db.update(articles).set({ status: "published" }).where(eq(articles.slug, slug));
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");                  // home, listings, sitemap, RSS
  revalidatePath("/blog", "layout");
}
```

## 4. Admin dashboard

- Put it under `src/app/(admin)/admin/…` with its own layout.
- Protect it with an authentication library (e.g. Auth.js or a hosted provider). Check the session in **every** Server Action and route handler, not only in the layout, and restrict access to an allow-list of editor accounts.
- Add `robots: { index: false }` metadata to the admin layout and disallow `/admin` in `robots.ts`.
- Validate every form with the Zod schemas from `src/lib/content/schema.ts`.

## 5. Security note on MDX

MDX can contain JavaScript expressions. That is fine for content written by trusted editors in Git. If untrusted users will ever submit content through an admin UI, either restrict them to plain Markdown or sanitize the source before rendering, and keep `disableImports` / `disableExports` enabled in `MdxContent.tsx`.
