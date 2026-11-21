/**
 * Spacing on an 8px grid (plus a 4px half-step). Screen margin is 16px (`4`).
 * Keys follow Tailwind naming (`1` = 0.25rem = 4px).
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
  /** Screen edge margin */
  screen: '1rem',
} as const

export type Spacing = typeof spacing
