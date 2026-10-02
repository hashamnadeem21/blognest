"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  clientId: string;
  slot: string;
  format: string;
  layout?: string;
}

/** Renders one AdSense unit and requests it exactly once (safe under React Strict Mode). */
export function AdUnit({ clientId, slot, format, layout }: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.adsbygoogleStatus || el.dataset.requested) return;
    el.dataset.requested = "true";
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn("[ads] AdSense push failed", error);
    }
  }, []);

  return (
    <ins
      ref={ref}
      className="adsbygoogle block h-full w-full"
      style={{ display: "block", textAlign: layout === "in-article" ? "center" : undefined }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive="true"
    />
  );
}
