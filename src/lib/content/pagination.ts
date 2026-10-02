export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    totalItems: items.length,
    hasPrevious: current > 1,
    hasNext: current < totalPages,
  };
}

/** Parses a `[page]` route param. Returns null for anything that isn't a canonical integer ≥ 2. */
export function parsePageParam(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const n = Number(value);
  return n >= 2 && Number.isSafeInteger(n) ? n : null;
}

export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}
