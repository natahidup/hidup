/**
 * Corner radii. Base is 4px; chip is 2px; bottom-sheet top corners are 12px.
 */
export const radius = {
  none: '0',
  /** Chip / tight control */
  chip: '2px',
  /** Base radius used by shadcn semantic tokens (`--radius`). */
  base: '4px',
  sm: '2px',
  md: '4px',
  lg: 'var(--radius)',
  xl: '8px',
  /** Bottom sheet top corners */
  sheet: '12px',
  '2xl': '12px',
  '3xl': '16px',
  '4xl': '24px',
  full: '9999px',
} as const

export type Radius = typeof radius
