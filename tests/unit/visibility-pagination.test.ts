import { describe, expect, it } from "vitest";
import { pageHref, paginate, parsePageParam } from "@/lib/content/pagination";
import { isPubliclyVisible } from "@/lib/content/visibility";

describe("isPubliclyVisible", () => {
  const now = new Date("2026-10-02T12:00:00Z");
  it("hides drafts", () => {
    expect(isPubliclyVisible({ status: "draft", publishedAt: "2026-01-01T00:00:00Z" }, now)).toBe(false);
  });
  it("hides scheduled (future) posts", () => {
    expect(isPubliclyVisible({ status: "published", publishedAt: "2026-10-03T00:00:00Z" }, now)).toBe(false);
  });
  it("shows published posts", () => {
    expect(isPubliclyVisible({ status: "published", publishedAt: "2026-10-01T00:00:00Z" }, now)).toBe(true);
  });
});

describe("pagination", () => {
  const items = Array.from({ length: 14 }, (_, i) => i);
  it("slices pages and reports navigation", () => {
    const p2 = paginate(items, 2, 6);
    expect(p2.items).toEqual([6, 7, 8, 9, 10, 11]);
    expect(p2).toMatchObject({ page: 2, totalPages: 3, hasPrevious: true, hasNext: true });
  });
  it("clamps out-of-range pages", () => {
    expect(paginate(items, 99, 6).page).toBe(3);
    expect(paginate([], 1, 6).totalPages).toBe(1);
  });
  it("only accepts canonical page params ≥ 2", () => {
    expect(parsePageParam("2")).toBe(2);
    for (const bad of ["1", "0", "02", "-1", "2.5", "abc", ""]) expect(parsePageParam(bad)).toBeNull();
  });
  it("builds clean URLs", () => {
    expect(pageHref("/blog", 1)).toBe("/blog");
    expect(pageHref("/blog", 3)).toBe("/blog/page/3");
  });
});
