# Nata

Cloudflare · Alchemy · Foldkit · Effect.

Nata is a multi-module super app on Cloudflare Workers. Cloudflare runs the
code, Alchemy owns the infrastructure, Foldkit owns the UI, and Effect owns
the server and the shared contract. Modules share `natahidup.app` and are
routed by path — for example `/karir`, `/uang`, `/kencan`.

Each module has its own Foldkit web app under `apps/` and its own API Worker
under `services/`. Alchemy composes them in one stack. Locally, the website
Worker forwards same-origin `/api/<module>/*` requests through a service
binding; in production, Cloudflare Workers Routes send `/karir*` and
`/api/karir*` to the matching Workers.

The starter also includes:

- A Foldkit RPC client that is already wired into NataKarir.
- Sentry errors, traces, and profiles in the browser, and errors and traces in
  both Workers. Without a DSN the SDK stays off.
- A per-IP rate limit on the karir API Worker that fails open.
- A D1 store recipe, a platform adapter seam, and a manual deploy workflow.

## Apps, services, and packages

- `apps/karir` — NataKarir Foldkit application, website Worker, and static
  assets, served under `/karir`.
- `services/karir` — Effect RPC handlers, the karir API Worker entry, and
  platform adapters, served under `/api/karir`.
- `packages/rpc` — one wire-contract package with a subdirectory per module
  (`@nata/rpc/karir`).
- Future: `apps/www` (landing) and `apps/mobile` are planned and not scaffolded
  yet.

## Get started

Requirements: Node.js 26 or newer and pnpm 12.

```sh
pnpm install
pnpm dev
```

The default Alchemy stack creates the karir website and API Workers.

## Make it yours

Run the rename script once, before the first feature:

```sh
pnpm rename my-app
pnpm install
```

It updates the package scope, the Alchemy stack name, page titles, the favicon
label, the test URL, and the README heading. It skips `pnpm-lock.yaml`; the
install refreshes it.

## Environment

Copy `.env.example` to `.env`. Sentry is optional: without a DSN the browser and
both Workers keep the SDK off. The source-map upload also needs
`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`.

The rate limit is declared in `alchemy.run.ts` and bound to the karir API
Worker. Change its `namespaceId` to a value that is unique in your Cloudflare
account.

## Orbs

The repository ships two executable scripts for Amp orbs. `.agents/setup`
installs the pinned Node.js and pnpm versions if they are missing, copies
`.env.example` to `.env` without overwriting an existing file, and installs the
workspace dependencies. `.agents/resume` repairs the Git hooks and a missing
`.env` after an orb wakes. It does not reinstall dependencies.

## Verify a change

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

`pnpm check` formats and lints through Vite+; the other scripts run through
Turbo. Pre-commit runs `pnpm check`, and pre-push runs the typecheck and the
tests.

## Deploy

`pnpm deploy` deploys the default stack to Cloudflare with the `prod` stage.
Read [Deploy](docs/deploy.md) for the token, state store, custom domain, and
the manual CI workflow.

The API Worker has no `workers.dev` URL. Locally the website reaches it through
its service binding; in production Workers Routes also send `/api/karir*` to it
on `natahidup.app`. Remove `workersDev: false` in `alchemy.run.ts` when the API
needs its own URL.

## Design notes

- Read [Architecture](docs/architecture.md) for apps, services, and RPC
  boundaries.
- Read [Tooling](docs/tooling.md) for Vite+, Turbo, `tsrs`, and Oxfmt/Oxlint
  responsibilities.
- Read [Guardrails](docs/guardrails.md) for the rules and the checks that
  enforce them.
- Read [Adding a feature](docs/extending.md) for the path from contract to
  handler to UI.
- Read [Recipes](docs/recipes.md) for a D1-backed store and a new binding.
- Read [Production](docs/production.md) for headers, rate limits, error
  reporting, and launch checks.
- Read [Deploy](docs/deploy.md) for the first deploy and the manual CI
  workflow.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
