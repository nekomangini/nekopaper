#!/usr/bin/env node
/**
 * Builds dist/sitemap.xml and dist/robots.txt from public/wallpapers.json.
 *
 * Runs as part of `postbuild` (after build-feed.mjs) so both always match the
 * deployed build; run standalone with `npm run seo`.
 *
 * Sitemap contents:
 *   - home (/)
 *   - every category route (derived from wallpapers.json → stays in sync)
 *   - /changelog
 *   - every download permalink, with <lastmod> from addedAt
 *
 * Search pages are intentionally excluded (utility, not content).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from './site.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

function main() {
  const file = path.join(repoRoot, 'public', 'wallpapers.json')
  if (!existsSync(file)) {
    console.error('❌ public/wallpapers.json not found — run `npm run metadata` first.')
    process.exit(1)
  }
  const wallpapers = JSON.parse(readFileSync(file, 'utf8')).wallpapers ?? []
  if (wallpapers.length === 0) {
    console.error('❌ public/wallpapers.json contains no wallpapers.')
    process.exit(1)
  }

  // Categories come from the data itself — a new asset folder is picked up
  // automatically without editing this script.
  const categories = [...new Set(wallpapers.map((w) => String(w.category ?? '').toLowerCase()))]
    .filter(Boolean)
    .sort()

  const urls = [{ loc: `${SITE_URL}/` }]
  for (const category of categories) urls.push({ loc: `${SITE_URL}/${category}` })
  urls.push({ loc: `${SITE_URL}/changelog` })

  let withLastmod = 0
  for (const w of wallpapers) {
    const category = String(w.category ?? '').toLowerCase()
    const hasDate = w.addedAt && !Number.isNaN(Date.parse(w.addedAt))
    if (hasDate) withLastmod++
    urls.push({
      loc: `${SITE_URL}/${category}/download/${w.slug}`,
      lastmod: hasDate ? w.addedAt.slice(0, 10) : undefined,
    })
  }

  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>` +
        (u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '') +
        `\n  </url>`,
    )
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`

  const distDir = path.join(repoRoot, 'dist')
  mkdirSync(distDir, { recursive: true })
  writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8')

  console.log(
    `✅ dist/sitemap.xml : ${urls.length} urls ` +
      `(1 home + ${categories.length} categories + 1 changelog + ${wallpapers.length} downloads)`,
  )
  console.log(`   lastmod on ${withLastmod}/${wallpapers.length} download urls`)
  console.log(`✅ dist/robots.txt : Sitemap: ${SITE_URL}/sitemap.xml`)
}

main()
