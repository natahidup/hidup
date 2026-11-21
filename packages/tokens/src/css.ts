import { semanticDark, semanticLight } from './semantic.ts'
import { themeInline } from './theme.ts'
import { typography } from './typography.ts'

const cssVarBlock = (vars: Record<string, string>, indent = '  '): string =>
  Object.entries(vars)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join('\n')

const themeInlineBlock = (): string =>
  Object.entries(themeInline)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n')

/**
 * Emit `tokens.css` from the TypeScript source of truth.
 * Run `pnpm --filter @nata/tokens generate` after editing token modules.
 */
export const emitTokensCss = (): string => {
  const light = { ...semanticLight }
  const dark = { ...semanticDark }
  // `--radius` is set once on :root; dark inherits the same base.
  const { radius: lightRadius, ...lightColors } = light
  const { radius: _darkRadius, ...darkColors } = dark

  return `/* Generated from @nata/tokens — do not edit by hand. Run: pnpm --filter @nata/tokens generate */

:root {
  --font-heading: ${typography.fontHeading};
${cssVarBlock({ radius: lightRadius, ...lightColors })}
}

/* TODO: Replace mirrored light values with a designed Nata dark palette. */
.dark {
${cssVarBlock(darkColors)}
}

@theme inline {
${themeInlineBlock()}
}
`
}
