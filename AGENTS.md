# Repository guide

This repository is a pnpm monorepo for Nata, a multi-module Effect + Foldkit
super app deployed to Cloudflare with Alchemy. Modules share the
`natahidup.app` origin and are routed by path (for example `/karir`, `/uang`,
`/kencan`).

## Package boundaries

- `apps/` holds user-facing deployables. `apps/karir` is the NataKarir Foldkit
  site and its website Worker, served under `/karir`. Its RPC client lives in
  `apps/karir/src/platform/rpc.ts`.
- `services/` holds backend Workers per domain. `services/karir` is the karir
  API Worker, served under `/api/karir`. `src/handler.ts` composes the RPC
  surface, `src/platform` owns host adapters, and `src/worker.ts` is the
  runtime entry.
- `packages/rpc` is one package (`@nata/rpc`) with a subdirectory per module
  (for example `packages/rpc/src/karir/...`), exposed via package exports
  subpaths such as `@nata/rpc/karir`.
- Future surfaces such as `apps/www` (landing) and `apps/mobile` are planned
  but not scaffolded here.
- Keep Alchemy resources and deployment composition in the root
  `alchemy.run.ts`. App- and service-owned `src/worker.ts` files are plain
  Cloudflare Worker entry modules and must not import Alchemy or declare
  infrastructure.
- Do not add a domain package or product domain until the product vocabulary
  and boundaries are agreed.

## Working agreements

- Keep the browser from importing `services/` or platform-specific modules.
- Keep RPC schemas and errors in `packages/rpc` under the module subdirectory;
  keep handlers and internal models in `services/<module>`.
- A context depends on the store interface it defines. Implement it in
  `services/<module>/src/platform`; compose it in
  `services/<module>/src/handler.ts`.
- Keep unstable Effect APIs inside the tsconfig allowlist for their file. See
  `docs/guardrails.md` before you widen one.
- Use Foldkit Query for retained remote data. Loading and revalidation
  decisions belong in Foldkit update handlers.
- Add a workspace package only for a real reusable or independently owned
  boundary.
- Keep Cloudflare services out of the starter unless a concrete feature needs
  them.
- Sentry lives at the app edges: the browser platform module, the Worker
  entries, and the Effect layers in `handler.ts`. Contexts use
  `Effect.withSpan` and never import Sentry. `ApiError` stays out of the issue
  stream.
- The karir API Worker rate limit fails open when its binding is missing or
  throws.
- Path routing is Cloudflare Workers Routes in `alchemy.run.ts` (no nginx).
- Use only `tsrs` and `effect-tsrs` for diagnostics. Never run `tsc` or
  `tsgo`; do not add `typescript` or turn on `typeCheck` in `vite.config.ts`.
- Effect diagnostics run in `pnpm typecheck`. `vp lint` stays on Vite+'s tsrs
  backend, so do not patch Oxlint.
- Run `pnpm rename <name>` once, before the first feature, to replace the
  template's package scope and stack name.

## Commands

- `pnpm dev` runs the default Alchemy stack.
- `pnpm check` runs Vite+ formatting, lint, and configured checks.
- `pnpm typecheck`, `pnpm test`, and `pnpm build` run through Turbo.
- `pnpm rename <name>` replaces the template's package scope and stack name.
- `.agents/setup` prepares a fresh orb: Node 26, pnpm 12, `.env`, and
  dependencies.
- `.agents/resume` repairs the hooks and `.env` after an orb wakes. It does
  not install dependencies.
- `pnpm deploy` changes Cloudflare infrastructure. Do not run it without
  explicit approval. The manual `Deploy` workflow does the same thing.

See `docs/architecture.md` and `docs/tooling.md` before changing workspace
boundaries or tool ownership. `docs/guardrails.md` lists the rules this
repository enforces and the check behind each one. `docs/recipes.md` shows the
D1 and binding path, `docs/deploy.md` covers deployment, and
`docs/production.md` covers the launch baseline.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
