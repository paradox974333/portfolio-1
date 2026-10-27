import { getSortedPosts, slugOf } from "@/components/blog/posts";
import { Section } from "@/components/site/section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

// The overlay the tracker draws when it loses its target: brackets, crosshair, no lock.
function LostTracking() {
  return (
    <div
      aria-hidden
      className="relative h-40 overflow-hidden rounded-lg border border-border bg-panel sm:h-48"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--gutter-dot) 1px, transparent 0)",
        backgroundSize: "14px 14px",
      }}
    >
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted-foreground/25" />
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-muted-foreground/25" />
      <svg
        viewBox="0 0 120 120"
        className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-signal sm:size-32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 30V8h22M90 8h22v22M112 90v22H90M30 112H8V90" />
        <circle cx="60" cy="60" r="5" strokeWidth="1.5" />
        <path d="M60 44v8M60 68v8M44 60h8M68 60h8" strokeWidth="1.5" opacity="0.6" />
      </svg>
      <span className="absolute left-1/2 top-1/2 ml-[3.75rem] -translate-y-[4.25rem] rounded-sm bg-flag-bg px-1.5 py-0.5 font-mono text-[0.6875rem] text-flag sm:ml-[4.25rem] sm:-translate-y-[4.75rem]">
        404 no lock
      </span>
      <span className="absolute bottom-2.5 left-3 font-mono text-[0.6875rem] text-muted-foreground">
        x: none, y: none
      </span>
    </div>
  );
}

const row =
  "flex items-baseline gap-4 px-5 py-3.5 transition-colors hover:bg-panel focus-visible:-outline-offset-2 sm:px-8";

export default function NotFound() {
  const posts = getSortedPosts();
  const latest = posts[0];

  const destinations = [
    { href: "/", title: "Home", detail: "Work, experience and what I'm building now" },
    {
      href: "/blog",
      title: "Writing",
      detail: `${posts.length} ${posts.length === 1 ? "post" : "posts"} on building AI agents`,
    },
    ...(latest
      ? [{ href: `/blog/${slugOf(latest)}`, title: latest.title, detail: "The latest post" }]
      : []),
  ];

  return (
    <main data-bleed>
      <section aria-labelledby="not-found-title" className="px-5 pt-2 sm:px-8">
        <LostTracking />
        <p className="mt-7 font-serif text-[1.625rem] italic leading-none">Lost tracking</p>
        <h1
          id="not-found-title"
          className="mt-3 text-balance text-[1.375rem] font-semibold leading-snug tracking-tight sm:text-[1.625rem]"
        >
          There&apos;s no page at this address.
        </h1>
        <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          The link may be old or mistyped, or the page has moved. One of these is probably what you
          were after.
        </p>
      </section>

      <Section id="elsewhere" label="Try one of these">
        <ul>
          {destinations.map((item) => (
            <li key={item.href} className="border-b border-border">
              <Link href={item.href} className={row}>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{item.detail}</span>
                </span>
              </Link>
            </li>
          ))}
          <li className="border-b border-border">
            <a href={`mailto:${DATA.contact.email}`} className={row}>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground">Email me</span>
                <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">
                  {DATA.contact.email}
                </span>
              </span>
            </a>
          </li>
        </ul>
      </Section>
    </main>
  );
}
