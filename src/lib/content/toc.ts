import GithubSlugger from "github-slugger";
import type { TocItem } from "./schema";

/**
 * Extracts H2/H3 headings from markdown, skipping fenced code blocks.
 * Uses github-slugger so ids match the ones rehype-slug assigns at render time.
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    // Every heading advances the slugger so duplicate ids stay in sync.
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) items.push({ id, text, depth });
  }

  return items;
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/**
 * Inserts an in-article ad marker before the Nth H2 (outside code fences)
 * when the author has not placed one manually.
 */
export function injectInArticleAd(markdown: string, beforeHeading = 3, marker = "<InArticleAd />"): string {
  if (markdown.includes("<InArticleAd")) return markdown;

  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let h2Count = 0;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^##\s+/.test(lines[i])) {
      h2Count++;
      if (h2Count === beforeHeading) {
        lines.splice(i, 0, "", marker, "");
        return lines.join("\n");
      }
    }
  }
  return markdown;
}
