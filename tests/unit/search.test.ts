import { describe, expect, it } from "vitest";
import { normalizeQuery, searchArticles, toPlainText } from "@/lib/content/search";
import { makeArticle } from "./fixtures";

const articles = [
  makeArticle({ slug: "passkeys", title: "Passkeys Explained", tags: ["security"], category: "technology" }),
  makeArticle({
    slug: "travel",
    title: "Packing Light",
    tags: ["packing"],
    category: "travel",
    excerpt: "How to travel with a single carry-on bag for two whole weeks without stress.",
    content: "Rolling clothes saves space. Passkeys are not mentioned here... actually passkeys once.",
  }),
  makeArticle({ slug: "ai", title: "Prompting Guide", tags: ["ai-tools"], category: "ai", content: "Write better prompts." }),
];

describe("searchArticles", () => {
  it("ranks title matches above body matches", () => {
    const results = searchArticles(articles, "passkeys");
    expect(results.map((r) => r.article.slug)).toEqual(["passkeys", "travel"]);
  });

  it("matches tags and categories", () => {
    expect(searchArticles(articles, "ai-tools")[0].article.slug).toBe("ai");
    expect(searchArticles(articles, "travel")[0].article.slug).toBe("travel");
  });

  it("requires every term to match", () => {
    expect(searchArticles(articles, "passkeys rolling").map((r) => r.article.slug)).toEqual(["travel"]);
  });

  it("returns nothing for empty or junk queries", () => {
    expect(searchArticles(articles, "   ")).toEqual([]);
    expect(searchArticles(articles, "zzzzqqq")).toEqual([]);
  });

  it("does not leak full content into results", () => {
    expect(searchArticles(articles, "prompts")[0].article).not.toHaveProperty("content");
  });
});

describe("helpers", () => {
  it("normalizes and truncates queries", () => {
    expect(normalizeQuery("  hello   world ")).toBe("hello world");
    expect(normalizeQuery("x".repeat(500))).toHaveLength(100);
    expect(normalizeQuery(undefined)).toBe("");
  });

  it("strips markdown and JSX", () => {
    expect(toPlainText('## Title\n<Callout type="tip">Hi [link](/x)</Callout>')).toBe("Title Hi link");
  });
});
