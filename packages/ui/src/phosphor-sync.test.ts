import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { expect, test } from 'vitest'
import * as Phosphor from './lib/phosphor.ts'

const require = createRequire(import.meta.url)
const coreRoot = dirname(dirname(require.resolve('@phosphor-icons/core')))

const catalog = {
  Check: 'check',
  ChevronRight: 'caret-right',
  ChevronDown: 'caret-down',
  ChevronLeft: 'caret-left',
  CircleCheck: 'check-circle',
  Info: 'info',
  LoaderCircle: 'circle-notch',
  OctagonX: 'x-circle',
  TriangleAlert: 'warning',
  X: 'x',
  Minus: 'minus',
} as const

const pathFromSvg = (svg: string): string => {
  const match = /d="([^"]+)"/.exec(svg)
  if (match === null || match[1] === undefined) {
    throw new Error('SVG path missing')
  }
  return match[1]
}

test('Phosphor icon nodes match @phosphor-icons/core regular SVGs', () => {
  for (const [exportName, file] of Object.entries(catalog)) {
    const svg = readFileSync(join(coreRoot, 'assets/regular', `${file}.svg`), 'utf8')
    const expected = pathFromSvg(svg)
    const node = Phosphor[exportName as keyof typeof catalog]
    expect(node[0]?.[0]).toBe('path')
    expect(node[0]?.[1]?.d).toBe(expected)
  }
})
