/**
 * Nata type ramp.
 * - Space Grotesk: display / body
 * - Space Mono: labels, captions, button labels (uppercase, tracking 0.08em)
 * Fonts load via Google Fonts link in the app (no @fontsource package).
 */
export const typography = {
  fontFamily: {
    sans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    heading: 'var(--font-heading)',
    mono: '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    /** Caption — 12 / 16 mono */
    caption: ['0.75rem', { lineHeight: '1rem' }],
    /** Button label — 14 mono bold uppercase */
    button: ['0.875rem', { lineHeight: '1.25rem' }],
    /** Body — 16 / 24 */
    body: ['1rem', { lineHeight: '1.5rem' }],
    /** Subtitle — 18 / 26 semibold */
    subtitle: ['1.125rem', { lineHeight: '1.625rem' }],
    /** Title — 28 / 34 bold */
    title: ['1.75rem', { lineHeight: '2.125rem' }],
    /** Tailwind-compatible aliases */
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.625rem' }],
    '2xl': ['1.75rem', { lineHeight: '2.125rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    /** Button / label mono uppercase */
    label: '0.08em',
  },
  fontHeading: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
} as const

export type Typography = typeof typography
