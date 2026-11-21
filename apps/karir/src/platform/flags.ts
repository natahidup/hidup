/**
 * Minimal feature flags. Prefer `import.meta.env.DEV` for local-only tools;
 * use `VITE_*` for opt-in in non-dev builds. No remote flag service yet.
 */
export const flags = {
  /**
   * Internal design-system showcase at `/karir/dev/ui` (also `/dev/ui` in bare Vite).
   * On in Vite dev, or when `VITE_UI_SHOWCASE=true`.
   */
  uiShowcase: import.meta.env.DEV || import.meta.env.VITE_UI_SHOWCASE === 'true',
} as const
