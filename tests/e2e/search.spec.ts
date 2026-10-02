import { expect, test } from "@playwright/test";

test("search finds articles by title, tag, category and body text", async ({ page }) => {
  await page.goto("/search");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.getByRole("searchbox", { name: "Search articles" }).fill("passkeys");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search\?q=passkeys/);
  await expect(page.getByTestId("search-results").getByRole("heading").first()).toHaveText(/Passkeys Explained/);

  for (const q of ["carry-on", "productivity", "router"]) {
    await page.goto(`/search?q=${q}`);
    await expect(page.getByTestId("search-results").getByRole("listitem").first()).toBeVisible();
  }
});

test("search handles no results gracefully", async ({ page }) => {
  await page.goto("/search?q=zzzxqv");
  await expect(page.getByTestId("search-summary")).toHaveText(/No articles matched/);
  await expect(page.getByRole("heading", { name: "Popular topics" })).toBeVisible();
});

test("header search link opens the search page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Search articles" }).click();
  await expect(page).toHaveURL(/\/search$/);
});
