import { Mail } from "lucide-react";
import { FacebookIcon, LinkedInIcon, XIcon } from "./BrandIcons";
import { CopyLinkButton } from "./CopyLinkButton";

/** Plain share links (no third-party scripts or tracking pixels). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Share on X", href: `https://x.com/intent/post?url=${u}&text=${t}`, Icon: XIcon },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedInIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${u}`, Icon: Mail },
  ];
  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted transition-colors hover:border-brand hover:text-link";

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="share-buttons">
      <span className="mr-1 text-sm font-medium text-muted">Share</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer nofollow"
          aria-label={label}
          title={label}
          className={btn}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <CopyLinkButton url={url} className={btn} />
    </div>
  );
}
