/**
 * Single source of truth for the production origin.
 *
 * Used by scripts/build-feed.mjs (feed permalinks) and
 * scripts/build-seo.mjs (sitemap URLs, robots.txt).
 *
 * NOTE: index.html cannot import this file (it is static HTML), so the same
 * origin is hardcoded there for canonical/og:url — update both together.
 */
export const SITE_URL = 'https://nekopaper.netlify.app'
