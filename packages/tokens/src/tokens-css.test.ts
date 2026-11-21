import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { emitTokensCss } from './css.ts'
import { semantic } from './semantic.ts'
import { themeInline } from './theme.ts'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const tokensCssPath = join(packageRoot, 'tokens.css')

test('tokens.css matches the TypeScript source of truth', () => {
  const onDisk = readFileSync(tokensCssPath, 'utf8')
  expect(onDisk).toBe(emitTokensCss())
})

test('semantic light and dark expose the shadcn token set', () => {
  const required = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
    'radius',
  ] as const

  for (const key of required) {
    expect(semantic.light[key]).toEqual(expect.any(String))
    expect(semantic.dark[key]).toEqual(expect.any(String))
  }
})

test('theme inline maps semantic colors to CSS variables', () => {
  expect(themeInline['color-background']).toBe('var(--background)')
  expect(themeInline['color-primary']).toBe('var(--primary)')
  expect(themeInline['radius-lg']).toBe('var(--radius)')
})
