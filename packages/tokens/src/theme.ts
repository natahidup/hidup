import { radius } from './radius.ts'
import { shadows } from './shadows.ts'
import { spacing } from './spacing.ts'
import { typography } from './typography.ts'

/**
 * Tailwind v4 `@theme inline` entries. Semantic colors map to CSS variables
 * so light/dark swap without regenerating utility classes.
 */
export const themeInline = {
  'color-background': 'var(--background)',
  'color-foreground': 'var(--foreground)',
  'color-card': 'var(--card)',
  'color-card-foreground': 'var(--card-foreground)',
  'color-popover': 'var(--popover)',
  'color-popover-foreground': 'var(--popover-foreground)',
  'color-primary': 'var(--primary)',
  'color-primary-foreground': 'var(--primary-foreground)',
  'color-secondary': 'var(--secondary)',
  'color-secondary-foreground': 'var(--secondary-foreground)',
  'color-muted': 'var(--muted)',
  'color-muted-foreground': 'var(--muted-foreground)',
  'color-accent': 'var(--accent)',
  'color-accent-foreground': 'var(--accent-foreground)',
  'color-destructive': 'var(--destructive)',
  'color-destructive-foreground': 'var(--destructive-foreground)',
  'color-border': 'var(--border)',
  'color-input': 'var(--input)',
  'color-ring': 'var(--ring)',
  'color-chart-1': 'var(--chart-1)',
  'color-chart-2': 'var(--chart-2)',
  'color-chart-3': 'var(--chart-3)',
  'color-chart-4': 'var(--chart-4)',
  'color-chart-5': 'var(--chart-5)',
  'color-sidebar': 'var(--sidebar)',
  'color-sidebar-foreground': 'var(--sidebar-foreground)',
  'color-sidebar-primary': 'var(--sidebar-primary)',
  'color-sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
  'color-sidebar-accent': 'var(--sidebar-accent)',
  'color-sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
  'color-sidebar-border': 'var(--sidebar-border)',
  'color-sidebar-ring': 'var(--sidebar-ring)',
  'font-sans': typography.fontFamily.sans,
  'font-heading': typography.fontFamily.heading,
  'font-mono': typography.fontFamily.mono,
  'radius-sm': radius.sm,
  'radius-md': radius.md,
  'radius-lg': radius.lg,
  'radius-xl': radius.xl,
  'radius-2xl': radius['2xl'],
  'radius-3xl': radius['3xl'],
  'radius-4xl': radius['4xl'],
  ...Object.fromEntries(Object.entries(spacing).map(([key, value]) => [`spacing-${key}`, value])),
  'shadow-sm': shadows.sm,
  shadow: shadows.DEFAULT,
  'shadow-md': shadows.md,
  'shadow-lg': shadows.lg,
  'shadow-xl': shadows.xl,
  'shadow-2xl': shadows['2xl'],
  'shadow-none': shadows.none,
} as const

export type ThemeInline = typeof themeInline
