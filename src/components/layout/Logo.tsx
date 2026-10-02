import Link from "next/link";
import { cn } from "@/lib/utils";

/** Inline SVG mark — no network request, crisp at any size, theme-independent. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="bn-mark-bg" x1="4" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#bn-mark-bg)" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M16 15h15.6c7 0 11.4 3.6 11.4 9.2 0 3.4-1.7 6-4.7 7.3 4.1 1.2 6.5 4.3 6.5 8.4 0 6.2-4.8 10.6-12.2 10.6H16V15Zm8.2 6.9v7.6h6.1c2.8 0 4.4-1.5 4.4-3.8s-1.6-3.8-4.4-3.8h-6.1Zm0 13.9v7.9h7c3.1 0 4.9-1.5 4.9-3.9s-1.8-4-4.9-4h-7Z"
      />
      <path d="M20.1 21.9v21.8" stroke="#C7D2FE" strokeWidth="1.6" strokeLinecap="round" />
      <path fill="#EEF2FF" d="M41.5 21.5C41.4 13.2 47.4 8 56.5 7.5c.2 8.9-5.9 14.6-15 14Z" />
      <path d="M42.6 20.6c3.3-4.2 6.8-7.4 11.4-10.7" stroke="#8B5CF6" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label="BlogNest home"
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="font-display text-[1.45rem] font-semibold leading-none tracking-tight">
        Blog<span className="text-gradient">Nest</span>
      </span>
    </Link>
  );
}
