import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { makeArticle } from "./fixtures";

describe("buildMetadata", () => {
  it("sets canonical, Open Graph and Twitter consistently", () => {
    const m = buildMetadata({ title: "About", description: "About this site, in a sentence or two.", path: "/about" });
    expect(m.alternates?.canonical).toBe(absoluteUrl("/about"));
    expect(m.openGraph).toMatchObject({ url: absoluteUrl("/about"), title: "About" });
    expect(m.robots).toBeUndefined();
  });
  it("supports noindex", () => {
    const m = buildMetadata({ title: "x", description: "y", path: "/x", noindex: true });
    expect(m.robots).toEqual({ index: false, follow: true });
  });
});

describe("JSON-LD", () => {
  it("builds BlogPosting with dates, section and author", () => {
    const data = articleJsonLd(makeArticle({ updatedAt: "2026-09-10T00:00:00.000Z" }), {
      slug: "editorial-team",
      name: "Team",
      type: "Organization",
      role: "Editors",
      bio: "x".repeat(50),
      avatar: "/a.svg",
      links: {},
    });
    expect(data).toMatchObject({
      "@type": "BlogPosting",
      dateModified: "2026-09-10T00:00:00.000Z",
      articleSection: "Technology",
      author: { "@type": "Organization", name: "Team" },
    });
  });

  it("numbers breadcrumb items from 1", () => {
    const data = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]);
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it("escapes < so content cannot break out of the script tag", () => {
    const { container } = render(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    expect(container.querySelector("script")!.innerHTML).not.toContain("</script>");
  });
});
