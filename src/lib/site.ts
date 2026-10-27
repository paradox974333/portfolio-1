/**
 * The canonical origin of this site, with no trailing slash.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL (set this once a custom domain exists, e.g. https://manoj.dev)
 *   2. https://${VERCEL_PROJECT_PRODUCTION_URL} (Vercel sets it at build and run time to the
 *      project's production host, so previews still point their canonicals at production)
 *   3. http://localhost:${PORT || 3000} for local development
 *
 * Note: DATA.url in src/data/resume.tsx is the GitHub profile, not this site. Use SITE_URL for
 * metadataBase, canonicals, Open Graph URLs, the sitemap, robots.txt and JSON-LD.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withScheme(explicit);

  // the NEXT_PUBLIC_ twin is what Vercel exposes to client bundles
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return withScheme(vercel);

  return `http://localhost:${process.env.PORT || 3000}`;
}

function withScheme(value: string): string {
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return url.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site path: absoluteUrl("/blog") -> "https://host/blog". */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
