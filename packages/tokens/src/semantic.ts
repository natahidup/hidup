import { colors } from './colors.ts'
import { radius } from './radius.ts'

/**
 * shadcn semantic tokens. Default is the foldcn / shadcn neutral palette.
 * Swap brand colors by editing this file only — components read CSS variables.
 */
export const semanticLight = {
  background: colors.white,
  foreground: colors.neutral['950'],
  card: colors.white,
  'card-foreground': colors.neutral['950'],
  popover: colors.white,
  'popover-foreground': colors.neutral['950'],
  primary: colors.neutral['900'],
  'primary-foreground': colors.neutral['50'],
  secondary: colors.neutral['100'],
  'secondary-foreground': colors.neutral['900'],
  muted: colors.neutral['100'],
  'muted-foreground': colors.neutral['500'],
  accent: colors.neutral['100'],
  'accent-foreground': colors.neutral['900'],
  destructive: 'oklch(0.577 0.245 27.325)',
  'destructive-foreground': 'oklch(0.97 0.01 17)',
  border: colors.neutral['200'],
  input: colors.neutral['200'],
  ring: colors.neutral['400'],
  'chart-1': 'oklch(0.646 0.222 41.116)',
  'chart-2': 'oklch(0.6 0.118 184.704)',
  'chart-3': 'oklch(0.398 0.07 227.392)',
  'chart-4': 'oklch(0.828 0.189 84.429)',
  'chart-5': 'oklch(0.769 0.188 70.08)',
  sidebar: colors.neutral['50'],
  'sidebar-foreground': colors.neutral['950'],
  'sidebar-primary': colors.neutral['900'],
  'sidebar-primary-foreground': colors.neutral['50'],
  'sidebar-accent': colors.neutral['100'],
  'sidebar-accent-foreground': colors.neutral['900'],
  'sidebar-border': colors.neutral['200'],
  'sidebar-ring': colors.neutral['400'],
  radius: radius.base,
} as const

export const semanticDark = {
  background: colors.neutral['950'],
  foreground: colors.neutral['50'],
  card: colors.neutral['900'],
  'card-foreground': colors.neutral['50'],
  popover: colors.neutral['900'],
  'popover-foreground': colors.neutral['50'],
  primary: colors.neutral['200'],
  'primary-foreground': colors.neutral['900'],
  secondary: colors.neutral['800'],
  'secondary-foreground': colors.neutral['50'],
  muted: colors.neutral['800'],
  'muted-foreground': colors.neutral['400'],
  accent: colors.neutral['700'],
  'accent-foreground': colors.neutral['50'],
  destructive: 'oklch(0.704 0.191 22.216)',
  'destructive-foreground': 'oklch(0.58 0.22 27)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: colors.neutral['500'],
  'chart-1': 'oklch(0.488 0.243 264.376)',
  'chart-2': 'oklch(0.696 0.17 162.48)',
  'chart-3': 'oklch(0.769 0.188 70.08)',
  'chart-4': 'oklch(0.627 0.265 303.9)',
  'chart-5': 'oklch(0.645 0.246 16.439)',
  sidebar: colors.neutral['900'],
  'sidebar-foreground': colors.neutral['50'],
  'sidebar-primary': 'oklch(0.488 0.243 264.376)',
  'sidebar-primary-foreground': colors.neutral['50'],
  'sidebar-accent': colors.neutral['800'],
  'sidebar-accent-foreground': colors.neutral['50'],
  'sidebar-border': 'oklch(1 0 0 / 10%)',
  'sidebar-ring': colors.neutral['500'],
  radius: radius.base,
} as const

export const semantic = {
  light: semanticLight,
  dark: semanticDark,
} as const

export type SemanticTokens = typeof semanticLight
export type SemanticMode = keyof typeof semantic
