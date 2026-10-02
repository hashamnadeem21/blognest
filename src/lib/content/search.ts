import { categories } from "@/lib/categories";
import type { Article, ArticleSummary } from "./schema";
import { toSummary } from "./visibility";

export interface SearchResult {
  article: ArticleSummary;
  score: number;
  /** Short plain-text snippet around the first content match. */
  snippet: string;
}

const MAX_QUERY_LENGTH = 100;

export function normalizeQuery(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.normalize("NFKC").replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1);
}

/** Strips MDX/markdown syntax so snippets and matching use readable text. */
export function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeSnippet(text: string, terms: string[], length = 160): string {
  const lower = text.toLowerCase();
  const index = terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (index === undefined) return "";
  const start = Math.max(0, index - 60);
  const snippet = text.slice(start, start + length).trim();
  return `${start > 0 ? "…" : ""}${snippet}${start + length < text.length ? "…" : ""}`;
}

/**
 * Weighted full-text search across title, tags, category, excerpt and body.
 * Every query term must match somewhere (AND semantics) for a result to count.
 */
export function searchArticles(articles: Article[], rawQuery: string, limit = 30): SearchResult[] {
  const query = normalizeQuery(rawQuery);
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const article of articles) {
    const title = article.title.toLowerCase();
    const excerpt = article.excerpt.toLowerCase();
    const tags = article.tags.join(" ").toLowerCase();
    const category = `${article.category} ${categories[article.category].name}`.toLowerCase();
    const body = toPlainText(article.content);
    const bodyLower = body.toLowerCase();

    let score = 0;
    let allMatched = true;

    for (const term of terms) {
      let termScore = 0;
      if (title.includes(term)) termScore += 10;
      if (tags.includes(term)) termScore += 6;
      if (category.includes(term)) termScore += 5;
      if (excerpt.includes(term)) termScore += 3;
      const bodyHits = bodyLower.split(term).length - 1;
      if (bodyHits > 0) termScore += Math.min(bodyHits, 5);
      if (termScore === 0) {
        allMatched = false;
        break;
      }
      score += termScore;
    }

    if (!allMatched) continue;
    if (title.includes(query.toLowerCase())) score += 15;

    results.push({ article: toSummary(article), score, snippet: makeSnippet(body, terms) || article.excerpt });
  }

  return results
    .sort((a, b) => b.score - a.score || b.article.publishedAt.localeCompare(a.article.publishedAt))
    .slice(0, limit);
}
