/**
 * Platform-neutral color scales. Names follow Tailwind's palette conventions
 * so a future brand swap edits values here without renaming call sites.
 * The default shadcn neutral (zinc) scale; brand colors replace these later.
 */
export const colors = {
  white: 'oklch(1 0 0)',
  black: 'oklch(0 0 0)',
  transparent: 'transparent',
  neutral: {
    '50': 'oklch(0.985 0 0)',
    '100': 'oklch(0.97 0 0)',
    '200': 'oklch(0.922 0 0)',
    '300': 'oklch(0.87 0 0)',
    '400': 'oklch(0.708 0 0)',
    '500': 'oklch(0.556 0 0)',
    '600': 'oklch(0.439 0 0)',
    '700': 'oklch(0.371 0 0)',
    '800': 'oklch(0.269 0 0)',
    '900': 'oklch(0.205 0 0)',
    '950': 'oklch(0.145 0 0)',
  },
} as const

export type Colors = typeof colors
