/**
 * Spacing on an 8px grid (plus a 4px half-step). Screen margin is 16px (`4`
 * or `page`). Keys follow Tailwind naming (`1` = 0.25rem = 4px).
 *
 * Do NOT use Tailwind's reserved sizing keywords as spacing keys — they collide
 * with built-in utilities (e.g. `--spacing-screen` breaks `min-h-screen` /
 * `h-screen` / `w-screen`). See `RESERVED_SPACING_KEYS` and the tokens test.
 */
export const spacing = {
  '0': '0',
  px: '1px',
  /** 4px — half step */
  '1': '0.25rem',
  /** 8px */
  '2': '0.5rem',
  /** 16px — screen margin */
  '4': '1rem',
  /** 24px */
  '6': '1.5rem',
  /** 32px */
  '8': '2rem',
  /** 48px */
  '12': '3rem',
  /** Screen edge margin (16px). Named `page` — never `screen`. */
  page: '1rem',
} as const

/**
 * Static Tailwind sizing/inset keywords. Defining `--spacing-<key>` for any of
 * these replaces the built-in utility value (100vh, 100%, auto, …).
 */
export const RESERVED_SPACING_KEYS = [
  'screen',
  'full',
  'auto',
  'min',
  'max',
  'fit',
  'svh',
  'lvh',
  'dvh',
  'svw',
  'lvw',
  'dvw',
] as const

export type Spacing = typeof spacing
