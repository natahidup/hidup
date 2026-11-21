import { colors } from './colors.ts'
import { radius } from './radius.ts'

/**
 * shadcn semantic tokens mapped to the Nata brand (light mode).
 * Edit this file to rebrand — components read CSS variables only.
 */
export const semanticLight = {
  background: colors.cream,
  foreground: colors.ink,
  card: colors.parchment,
  'card-foreground': colors.ink,
  popover: colors.parchment,
  'popover-foreground': colors.ink,
  primary: colors.indigo,
  'primary-foreground': colors.white,
  'primary-hover': colors.indigoPressed,
  secondary: colors.parchment,
  'secondary-foreground': colors.ink,
  muted: colors.sand,
  'muted-foreground': colors.mist,
  /** Vermilion — ornament only; never for large-surface text */
  accent: colors.vermilion,
  'accent-foreground': colors.white,
  destructive: colors.crimson,
  'destructive-foreground': colors.white,
  success: colors.fern,
  'success-foreground': colors.white,
  warning: colors.mustard,
  'warning-foreground': colors.ink,
  border: colors.stone,
  input: colors.sand,
  ring: colors.indigo,
  'chart-1': colors.indigo,
  'chart-2': colors.fern,
  'chart-3': colors.mustard,
  'chart-4': colors.vermilion,
  'chart-5': colors.mist,
  sidebar: colors.parchment,
  'sidebar-foreground': colors.ink,
  'sidebar-primary': colors.indigo,
  'sidebar-primary-foreground': colors.white,
  'sidebar-accent': colors.sand,
  'sidebar-accent-foreground': colors.ink,
  'sidebar-border': colors.stone,
  'sidebar-ring': colors.indigo,
  radius: radius.base,
} as const

/**
 * TODO: Design the Nata dark palette. Light values are mirrored only so the
 * `.dark` CSS block structure stays intact — do not treat these as approved dark.
 */
export const semanticDark = {
  background: colors.cream,
  foreground: colors.ink,
  card: colors.parchment,
  'card-foreground': colors.ink,
  popover: colors.parchment,
  'popover-foreground': colors.ink,
  primary: colors.indigo,
  'primary-foreground': colors.white,
  'primary-hover': colors.indigoPressed,
  secondary: colors.parchment,
  'secondary-foreground': colors.ink,
  muted: colors.sand,
  'muted-foreground': colors.mist,
  accent: colors.vermilion,
  'accent-foreground': colors.white,
  destructive: colors.crimson,
  'destructive-foreground': colors.white,
  success: colors.fern,
  'success-foreground': colors.white,
  warning: colors.mustard,
  'warning-foreground': colors.ink,
  border: colors.stone,
  input: colors.sand,
  ring: colors.indigo,
  'chart-1': colors.indigo,
  'chart-2': colors.fern,
  'chart-3': colors.mustard,
  'chart-4': colors.vermilion,
  'chart-5': colors.mist,
  sidebar: colors.parchment,
  'sidebar-foreground': colors.ink,
  'sidebar-primary': colors.indigo,
  'sidebar-primary-foreground': colors.white,
  'sidebar-accent': colors.sand,
  'sidebar-accent-foreground': colors.ink,
  'sidebar-border': colors.stone,
  'sidebar-ring': colors.indigo,
  radius: radius.base,
} as const

export const semantic = {
  light: semanticLight,
  dark: semanticDark,
} as const

export type SemanticTokens = typeof semanticLight
export type SemanticMode = keyof typeof semantic
