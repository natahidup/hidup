/**
 * Corner radii. `--radius` is the base; sm/md/lg/xl scale from it the way
 * shadcn / Tailwind v4 theme mapping expects.
 */
export const radius = {
  none: '0',
  /** Base radius used by shadcn semantic tokens. */
  base: '0.625rem',
  sm: 'calc(var(--radius) * 0.6)',
  md: 'calc(var(--radius) * 0.8)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) * 1.4)',
  '2xl': 'calc(var(--radius) * 1.8)',
  '3xl': 'calc(var(--radius) * 2.2)',
  '4xl': 'calc(var(--radius) * 2.6)',
  full: '9999px',
} as const

export type Radius = typeof radius
