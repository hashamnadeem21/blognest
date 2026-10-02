import { describe, expect, it } from "vitest";
import { extractToc, injectInArticleAd } from "@/lib/content/toc";

describe("extractToc", () => {
  it("collects h2/h3 with github-style ids and skips code fences", () => {
    const md = ["# Title", "## First *section*", "text", "```", "## not a heading", "```", "### Sub [link](/x)", "## First section"].join("\n");
    expect(extractToc(md)).toEqual([
      { id: "first-section", text: "First section", depth: 2 },
      { id: "sub-link", text: "Sub link", depth: 3 },
      { id: "first-section-1", text: "First section", depth: 2 },
    ]);
  });
});

describe("injectInArticleAd", () => {
  const md = ["intro", "## One", "a", "## Two", "b", "## Three", "c"].join("\n");

  it("inserts the marker before the third h2", () => {
    const out = injectInArticleAd(md);
    expect(out.indexOf("<InArticleAd />")).toBeLessThan(out.indexOf("## Three"));
    expect(out.indexOf("<InArticleAd />")).toBeGreaterThan(out.indexOf("## Two"));
  });

  it("respects a manually placed marker", () => {
    const manual = `${md}\n<InArticleAd />`;
    expect(injectInArticleAd(manual)).toBe(manual);
  });

  it("leaves short articles untouched", () => {
    expect(injectInArticleAd("## Only\ntext")).toBe("## Only\ntext");
  });
});
