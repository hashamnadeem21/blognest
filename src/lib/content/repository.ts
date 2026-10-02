import type { Article, Author } from "./schema";

/**
 * Storage-agnostic contract for content. The site only talks to this
 * interface (through `src/lib/content/index.ts`), so the MDX implementation
 * can be swapped for a PostgreSQL / headless-CMS implementation without
 * touching pages or components.
 *
 * Repositories return ALL articles (drafts included). Visibility rules are
 * enforced in one place — `isPubliclyVisible()` in the service layer.
 */
export interface ContentRepository {
  listArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  listAuthors(): Promise<Author[]>;
  getAuthor(slug: string): Promise<Author | null>;
}
