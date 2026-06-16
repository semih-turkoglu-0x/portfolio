/**
 * Canonical base URL for the site, used by the sitemap (and available for
 * `metadataBase`, Open Graph, etc.).
 *
 * Set `NEXT_PUBLIC_SITE_URL` in your environment (e.g. on Vercel) once the
 * custom domain is live. Falls back to the Vercel production URL, then the
 * known production deployment.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://portfolio-semih-t.vercel.app")
).replace(/\/$/, "");
