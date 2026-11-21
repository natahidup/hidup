import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Utilities that must appear when Tailwind scans @nata/ui. */
const requiredUtilities = [
  '.bg-primary',
  '.text-primary-foreground',
  '.bg-destructive',
  '.bg-muted',
  '.bg-card',
  '.border-border',
  '.h-12',
  '.min-h-14',
  '.p-6',
  '.px-\\(--card-spacing\\)',
  '.rounded-\\[var\\(--radius\\)\\]',
] as const

test('built CSS includes @nata/ui brand utilities', () => {
  execFileSync('pnpm', ['exec', 'vite', 'build'], {
    cwd: appRoot,
    stdio: 'pipe',
    env: process.env,
  })

  const cssName = readdirSync(join(appRoot, 'dist/assets')).find((name) => name.endsWith('.css'))
  expect(cssName).toEqual(expect.any(String))
  const css = readFileSync(join(appRoot, 'dist/assets', cssName!), 'utf8')

  for (const utility of requiredUtilities) {
    expect(css, `missing utility ${utility}`).toMatch(new RegExp(utility.replace(/^\./, '\\.')))
  }

  // Viewport height must not be collapsed by a custom spacing-screen token.
  expect(css).toMatch(/\.min-h-screen\{[^}]*min-height:100vh/)
})
