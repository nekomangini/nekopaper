#!/usr/bin/env node
/**
 * Generates wallpaper date metadata from git history.
 *
 * Outputs:
 *   src/config/addedDates.json  map of "category/sub/name.webp" -> ISO-8601 date
 *   public/wallpapers.json      existing catalog, regenerated with addedAt
 *
 * Usage: npm run metadata
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = path.join(repoRoot, 'src', 'assets')
const validExts = new Set(['.webp', '.jpg', '.jpeg', '.png'])

function git(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
}

/**
 * Walk the whole history oldest-first and record the first date each path
 * appeared. Renames (R100 old new) hand the old path's date to the new path,
 * so renamed wallpapers keep their original upload date.
 */
function buildDatesFromHistory() {
  const dates = new Map()
  const log = git([
    'log', '--reverse', '--name-status',
    '--format=COMMIT %aI', '-M', '--diff-filter=AR',
  ])

  let current = null
  for (const raw of log.split('\n')) {
    if (raw.startsWith('COMMIT ')) {
      current = raw.slice('COMMIT '.length).trim()
      continue
    }
    if (!raw.trim() || !current) continue

    const [status, ...paths] = raw.split('\t')
    if (status === 'A') {
      const added = paths[0]
      if (added && !dates.has(added)) dates.set(added, current)
    } else if (status.startsWith('R') && paths.length >= 2) {
      const [oldPath, newPath] = paths
      const inherited = dates.get(oldPath) ?? current
      if (newPath && !dates.has(newPath)) dates.set(newPath, inherited)
    }
  }
  return dates
}

/** Fallback for paths git does not know (e.g. freshly added, uncommitted). */
function dateViaFollow(gitPath) {
  try {
    const out = git(['log', '--follow', '--diff-filter=A', '--format=%aI', '--', gitPath])
    const lines = out.split('\n').map((l) => l.trim()).filter(Boolean)
    return lines.length ? lines[lines.length - 1] : null // oldest = last
  } catch {
    return null
  }
}

function walkAssets(dir, base = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      out.push(...walkAssets(path.join(dir, entry.name), rel))
    } else if (validExts.has(path.extname(entry.name).toLowerCase())) {
      out.push(rel)
    }
  }
  return out
}

// title/slug rules MUST mirror src/config/images.ts exactly (lines 36 + 43),
// otherwise feed permalinks/titles diverge from what the app serves:
//   images.ts: slug = filename.toLocaleLowerCase().replace(/[_-]/g, '-')
//   images.ts: title = filename.replace(/[_-]/g, ' ')
// (Formerly title-cased via make_json.py's toTitle — that made every feed title
// differ from the site, and a non-lowercased slug would 404 for uppercase files.)

function main() {
  const files = walkAssets(assetsDir).sort()
  const history = buildDatesFromHistory()
  const addedDates = {}
  const fallbacks = []

  for (const rel of files) {
    const gitPath = `src/assets/${rel}`
    let date = history.get(gitPath) ?? dateViaFollow(gitPath)
    if (!date) {
      // Uncommitted file: fall back to its modification time.
      date = fs.statSync(path.join(assetsDir, rel)).mtime.toISOString()
      fallbacks.push(rel)
    }
    addedDates[rel] = date
  }

  fs.mkdirSync(path.join(repoRoot, 'src', 'config'), { recursive: true })
  fs.writeFileSync(
    path.join(repoRoot, 'src', 'config', 'addedDates.json'),
    JSON.stringify(addedDates, null, 2) + '\n',
    'utf8',
  )

  const wallpapers = files.map((rel) => {
    const parts = rel.split('/')
    const filename = parts[parts.length - 1]
    const noExt = filename.replace(/\.\w+$/, '')
    return {
      // mirrors src/config/images.ts verbatim — keep the two in sync
      title: noExt.replace(/[_-]/g, ' '),
      slug: noExt.toLocaleLowerCase().replace(/[_-]/g, '-'),
      category: parts.length > 1 ? parts[0][0].toUpperCase() + parts[0].slice(1) : 'Other',
      imagePath: `assets/${rel}`,
      addedAt: addedDates[rel],
    }
  })
  wallpapers.sort((a, b) =>
    a.category === b.category ? a.title.localeCompare(b.title) : a.category.localeCompare(b.category),
  )

  fs.writeFileSync(
    path.join(repoRoot, 'public', 'wallpapers.json'),
    JSON.stringify({ wallpapers }, null, 2) + '\n',
    'utf8',
  )

  console.log(`✅ addedDates.json  : ${files.length} wallpapers dated`)
  console.log(`✅ wallpapers.json  : ${wallpapers.length} entries (with addedAt)`)
  if (fallbacks.length) {
    console.log(`⚠️  ${fallbacks.length} uncommitted file(s) used mtime:`)
    fallbacks.forEach((f) => console.log(`     ${f}`))
  }

  // newest 5, for a quick sanity check
  const newest = Object.entries(addedDates)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 5)
  console.log('\nNewest 5:')
  newest.forEach(([k, v]) => console.log(`  ${v.slice(0, 10)}  ${k}`))
}

main()
