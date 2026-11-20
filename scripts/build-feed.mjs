#!/usr/bin/env node
/**
 * Builds dist/feed.xml — an RSS 2.0 feed of the most recently added wallpapers.
 *
 * Runs automatically as `postbuild` (so it always matches the deployed build);
 * run standalone with `npm run feed`.
 *
 * Data comes from public/wallpapers.json, which `npm run metadata` generates
 * from git history — never hand-edited.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from './site.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Production origin — imported from ./site.mjs (shared with build-seo.mjs). */
const SITE_TITLE = 'ネコpaper — Recently Added'
const SITE_DESCRIPTION =
  'My personal aesthetic collection of wallpapers. New uploads, newest first.'
const FEED_PATH = '/feed.xml'
const ITEM_LIMIT = 50

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** Keeps a literal "]]>" from terminating the CDATA section early. */
const escapeCdata = (value) => String(value).replace(/]]>/g, ']]]]><![CDATA[>')

function loadWallpapers() {
  const file = path.join(repoRoot, 'public', 'wallpapers.json')
  if (!existsSync(file)) {
    console.error('❌ public/wallpapers.json not found — run `npm run metadata` first.')
    process.exit(1)
  }
  const data = JSON.parse(readFileSync(file, 'utf8'))
  return Array.isArray(data.wallpapers) ? data.wallpapers : []
}

/**
 * Resolves `assets/…` source paths to the hashed files Vite actually emits.
 * Primary: build manifest. Fallback: basename match against dist/assets
 * (safe because we only accept a strip when the result is a known source name).
 */
function buildImageResolver(sourceBasenames) {
  const distAssets = path.join(repoRoot, 'dist', 'assets')
  const bySource = new Map()
  const byBase = new Map()

  for (const manifestFile of [
    path.join(repoRoot, 'dist', '.vite', 'manifest.json'),
    path.join(repoRoot, 'dist', 'manifest.json'),
  ]) {
    if (!existsSync(manifestFile)) continue
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
    for (const [source, entry] of Object.entries(manifest)) {
      if (entry && typeof entry.file === 'string') bySource.set(source, entry.file)
    }
    break
  }

  if (existsSync(distAssets)) {
    for (const name of readdirSync(distAssets)) {
      const stripped = name.replace(/-[A-Za-z0-9_-]{8}(\.[^.]+)$/, '$1')
      if (sourceBasenames.has(stripped)) byBase.set(stripped, name)
      else if (sourceBasenames.has(name)) byBase.set(name, name)
    }
  }

  const usedFallback = { value: false }

  return {
    resolve(imagePath) {
      const source = `src/${imagePath}` // "assets/a/b.webp" -> "src/assets/a/b.webp"
      const emitted = bySource.get(source) ?? byBase.get(path.basename(imagePath))
      if (!emitted) return null
      if (!bySource.has(source)) usedFallback.value = true
      return `${SITE_URL}/${emitted.replace(/^\/+/, '')}`
    },
    get usedFallback() {
      return usedFallback.value
    },
    get manifestFound() {
      return bySource.size > 0
    },
  }
}

function main() {
  const wallpapers = loadWallpapers()
  if (wallpapers.length === 0) {
    console.error('❌ public/wallpapers.json contains no wallpapers.')
    process.exit(1)
  }

  const sourceBasenames = new Set(wallpapers.map((w) => path.basename(w.imagePath)))
  const resolver = buildImageResolver(sourceBasenames)

  const items = wallpapers
    .filter((w) => w.addedAt && !Number.isNaN(Date.parse(w.addedAt)))
    .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
    .slice(0, ITEM_LIMIT)

  if (items.length === 0) {
    console.error('❌ No wallpapers with a valid addedAt date.')
    process.exit(1)
  }

  const newest = Date.parse(items[0].addedAt)
  const buildDate = new Date(newest).toUTCString()

  const itemXml = items
    .map((w) => {
      const category = String(w.category ?? '').toLowerCase()
      const permalink = `${SITE_URL}/${category}/download/${w.slug}`
      const imageUrl = resolver.resolve(w.imagePath)
      const addedShort = new Date(w.addedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      const parts = [`<p>Added ${escapeXml(addedShort)} &middot; ${escapeXml(w.category)}</p>`]
      if (imageUrl) parts.push(`<img src="${escapeXml(imageUrl)}" alt="${escapeXml(w.title)}" />`)
      parts.push(`<p><a href="${escapeXml(permalink)}">Download ${escapeXml(w.title)}</a></p>`)

      return [
        '    <item>',
        `      <title>${escapeXml(w.title)}</title>`,
        `      <link>${escapeXml(permalink)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(permalink)}</guid>`,
        `      <pubDate>${new Date(w.addedAt).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(w.category)}</category>`,
        `      <description><![CDATA[${escapeCdata(parts.join(''))}]]></description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(`${SITE_URL}/`)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}${FEED_PATH}`)}" rel="self" type="application/rss+xml" />
    <generator>nekopaper scripts/build-feed.mjs</generator>
${itemXml}
  </channel>
</rss>
`

  const outFile = path.join(repoRoot, 'dist', 'feed.xml')
  mkdirSync(path.dirname(outFile), { recursive: true })
  writeFileSync(outFile, xml, 'utf8')

  const missingImage = items.filter((w) => !resolver.resolve(w.imagePath)).length
  console.log(`✅ dist/feed.xml : ${items.length} items (limit ${ITEM_LIMIT})`)
  console.log(`   newest        : ${items[0].title} — ${items[0].addedAt.slice(0, 10)}`)
  console.log(
    `   image urls    : ${items.length - missingImage}/${items.length} resolved` +
      ` (${resolver.manifestFound ? 'manifest' : 'basename'} source${resolver.usedFallback ? ', fallback used' : ''})`,
  )
  if (missingImage > 0) {
    console.log(`⚠️  ${missingImage} item(s) shipped without an image (source not found in dist).`)
  }
}

main()
