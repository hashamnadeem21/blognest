import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isActivePath } from "@/components/layout/NavLinks";
import { Pagination } from "@/components/ui/Pagination";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Pagination", () => {
  it("renders crawlable links with rel prev/next and marks the current page", () => {
    render(<Pagination basePath="/blog" page={2} totalPages={3} />);
    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute("rel", "prev");
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute("href", "/blog/page/3");
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination basePath="/blog" page={1} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("isActivePath", () => {
  it("matches sections but not prefixes of other words", () => {
    expect(isActivePath("/blog/how-passkeys-work", "/blog")).toBe(true);
    expect(isActivePath("/blogroll", "/blog")).toBe(false);
    expect(isActivePath("/about", "/")).toBe(false);
  });
});
