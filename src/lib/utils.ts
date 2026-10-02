export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Formats in UTC so server and client render identical strings (no hydration mismatch). */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export function humanizeTag(tag: string): string {
  return tag.replace(/-/g, " ");
}
