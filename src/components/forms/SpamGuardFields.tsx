"use client";

import { useCallback, useEffect, useRef } from "react";

/** Honeypot field — visually hidden and skipped by keyboard/screen readers; bots tend to fill it. */
export function SpamGuardFields() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company (leave blank)
        <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/**
 * Wraps a form action so every submission carries the time the form became
 * interactive. Recorded after mount, so static HTML never holds a stale value
 * and it survives React's automatic form reset after an action.
 */
export function useTimedAction(action: (formData: FormData) => void) {
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  return useCallback(
    (formData: FormData) => {
      formData.set("startedAt", String(mountedAt.current));
      action(formData);
    },
    [action],
  );
}

export function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">
      {errors[0]}
    </p>
  );
}
