/**
 * Nata brand palette. Names follow Tailwind conventions so semantic tokens and
 * a future mobile package can share the same keys.
 */
export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  /** Page canvas */
  cream: '#FAF7F1',
  /** Card / popover / secondary surface */
  parchment: '#FFFDF8',
  /** Input fill */
  sand: '#EAE3D6',
  /** Borders */
  stone: '#D6CEC0',
  /** Body ink */
  ink: '#1B1B1F',
  /** Secondary text */
  mist: '#6B6660',
  /** Primary indigo */
  indigo: '#2E4A6B',
  /** Primary pressed / hover */
  indigoPressed: '#23395B',
  /** Destructive / error */
  crimson: '#9E1B1B',
  /** Success */
  fern: '#3E7C59',
  /** Warning / mustard */
  mustard: '#F0B23A',
  /** Accent vermilion — ornament only, never large-surface text */
  vermilion: '#E8452C',
} as const

export type Colors = typeof colors
