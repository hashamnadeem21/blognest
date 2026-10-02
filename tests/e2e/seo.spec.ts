import { expect, test } from "@playwright/test";

const INDEXABLE = [
  "/",
  "/blog",
  "/latest",
  "/trending",
  "/category/technology",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/editorial-policy",
  "/corrections-policy",
  "/advertising-disclosure",
  "/authors/editorial-team",
];

test("every indexable page has a unique title, description and self canonical", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of INDEXABLE) {
    await page.goto(path);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(title, path).toBeTruthy();
    expect(description, path).toBeTruthy();
    expect(new URL(canonical!).pathname, path).toBe(path);
    expect(await page.locator('meta[name="robots"][content*="noindex"]').count(), path).toBe(0);
    await expect(page.locator("h1"), path).toHaveCount(1);
    titles.add(title);
    descriptions.add(description!);
  }
  expect(titles.size).toBe(INDEXABLE.length);
  expect(descriptions.size).toBe(INDEXABLE.length);
});

test("sitemap, robots, RSS and manifest are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("/blog/how-passkeys-work");
  expect(xml).toContain("/category/ai");
  expect(xml).not.toContain("/search");

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  expect(robots).toContain("Disallow: /api/");

  const rss = await request.get("/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(await rss.text()).toContain("<item>");

  expect((await request.get("/manifest.webmanifest")).ok()).toBe(true);
  expect((await request.get("/opengraph-image")).headers()["content-type"]).toBe("image/png");
  // ads.txt is only served once an AdSense client ID is configured.
  expect((await request.get("/ads.txt")).status()).toBe(404);
});
