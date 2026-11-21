# Design system

## Tokens vs UI

| Package        | Role                                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nata/tokens` | Platform-neutral TypeScript source of truth for color, spacing, radius, typography, shadows, and shadcn semantic tokens (light/dark). Emits `tokens.css` (`:root` / `.dark` + Tailwind v4 `@theme inline`). |
| `@nata/ui`     | Foldkit foldcn components built on `@foldkit/ui`. Imports theme from `@nata/tokens` — no duplicated CSS variables.                                                                                          |

A future mobile package should import TypeScript tokens from `@nata/tokens`, not the CSS entry. Brand colors change by editing token modules only, then regenerating CSS.

```sh
pnpm --filter @nata/tokens generate
pnpm --filter @nata/tokens test
```

The tokens test fails when `tokens.css` drifts from the TypeScript emitter.

## Adding a foldcn component

foldcn is a shadcn-compatible registry for Foldkit ([docs](https://foldcn.elianiva.com), [llms.txt](https://foldcn.elianiva.com/llms.txt)).

1. From `packages/ui`, ensure `components.json` registers `@foldcn`:

   ```json
   "registries": {
     "@foldcn": "https://foldcn.elianiva.com/r/{name}.json"
   }
   ```

2. Add the component (example: checkbox):

   ```sh
   pnpm --filter @nata/ui exec shadcn add @foldcn/checkbox
   ```

3. Point theme at `@nata/tokens` — do not paste foldcn's hardcoded `:root` palette into `styles.css`.
4. Replace every `lucide` import with Phosphor equivalents in `src/lib/phosphor.ts` + `src/lib/icons.ts`.
5. Adapt optional props for `exactOptionalPropertyTypes` with `defined()` from `src/lib/optional.ts` when forwarding into `@foldkit/ui`.
6. Export the component from `packages/ui/src/index.ts` (stateful submodels as `export * as Name`).

## Phosphor rule

Use `@phosphor-icons/core` (SVG path assets, no React). Do not install `lucide`. Icon nodes in `packages/ui/src/lib/phosphor.ts` are kept in sync with the package's regular SVGs by `phosphor-sync.test.ts`. Render them with `icon()` from `packages/ui/src/lib/icons.ts` (256×256 viewBox, `fill="currentColor"`).

## Showcase

`apps/karir` exposes an internal gallery at `/karir/dev/ui` (Vite base `/karir`) when `import.meta.env.DEV` is true, or when `VITE_UI_SHOWCASE=true`. Flags live in `apps/karir/src/platform/flags.ts`.
