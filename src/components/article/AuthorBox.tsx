import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/lib/content";

export function AuthorBox({ author }: { author: Author }) {
  return (
    <section
      aria-labelledby="author-heading"
      className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-6 sm:flex-row sm:items-start sm:p-8"
    >
      <Image src={author.avatar} alt="" width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-full" />
      <div>
        <p className="eyebrow">Written by</p>
        <h2 id="author-heading" className="mt-1 font-display text-xl font-semibold">
          <Link href={`/authors/${author.slug}`} className="hover:text-link">
            {author.name}
          </Link>
        </h2>
        <p className="text-sm text-muted">{author.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{author.bio}</p>
        <p className="mt-3 text-sm">
          <Link href="/editorial-policy" className="font-medium text-link hover:underline">
            How we research and edit articles →
          </Link>
        </p>
      </div>
    </section>
  );
}
