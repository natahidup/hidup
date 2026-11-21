# Architecture

## Runtime boundaries

Nata is a multi-module super app. Each module has a Foldkit web app in `apps/`
and an API Worker in `services/`. The first module is NataKarir:

- `apps/karir` is served under `/karir`
- `services/karir` is served under `/api/karir`

The browser sends requests to the shared origin (`natahidup.app`). Path routing
is Cloudflare Workers Routes declared in the root `alchemy.run.ts` (no nginx).
Locally, the website Worker still forwards `/api/karir/*` to the API Worker
through an Alchemy-managed service binding so same-origin RPC works under
`alchemy dev`.

```text
Browser / Foldkit (/karir)
       │ same-origin /api/karir/rpc
       ▼
Karir Website Worker ── service binding ──► Karir API Worker
       │                                         │
       │ (prod Workers Routes)                   │ (prod Workers Routes)
       │  natahidup.app/karir*                   │  natahidup.app/api/karir*
       ▼                                         ▼
  static assets                            Effect RPC
                                                 │
                                                 ▼
                                          @nata/rpc/karir
```

The service binding is a deployment convenience for local and for requests that
still hit the website Worker. Business handlers must not depend on Cloudflare
types or bindings. The root `alchemy.run.ts` owns all resource declarations.
Each app or service exposes a plain `src/worker.ts` runtime entry module; these
modules do not import Alchemy or declare infrastructure.

Future modules (for example `/uang`, `/kencan`) follow the same shape:
`apps/<module>`, `services/<module>`, and `packages/rpc/src/<module>` with
matching Workers Routes. `apps/www` (landing) and `apps/mobile` are planned and
not scaffolded yet.

## Request routing

`packages/rpc/src/karir/paths.ts` owns `WEB_BASE`, `API_PREFIX`, and
`RPC_PATH`. `alchemy.run.ts` derives the website's `runWorkerFirst` rule and the
prod Workers Routes from those values, so the path that the contract declares
and the path that the deployment routes cannot drift apart. `apps/karir` sets
Vite `base` from `WEB_BASE`; any Foldkit router base must stay aligned with it.

The website Worker therefore receives API requests under that prefix when they
arrive on its surface, and forwards them to the API Worker through the service
binding. Every other `/karir` path is served from the static assets, including
the client-side fallback for unmatched routes.

The API Worker sets `workersDev: false`. Locally the website origin is its only
public surface. In production, the `/api/karir*` Workers Route is the public
API path on `natahidup.app`.

## Backend composition

`services/karir/src/handler.ts` owns the RPC composition. `handlerFor` takes one
handler layer per context and returns a web handler. The default input is the
real set. A test passes a fake layer and never starts the Worker.

A context defines the store interface it needs. `services/karir/src/platform`
implements it with D1, R2, a Durable Object, or another binding. `handler.ts`
supplies the implementation. `services/karir/src/worker.ts` stays a thin runtime
entry that rate-limits, builds the handler from its bindings, and exports
`fetch`.

`services/karir/src/boundaries.test.ts` enforces three directions: contexts do
not import host adapters, the browser does not import service code, and the wire
contract does not import either deployable.

## Rate limits

The karir API Worker applies a per-IP limit before it reaches the RPC handler.
`RATE_LIMIT_API` is declared in `alchemy.run.ts` and bound to the `KarirApi`
env. The worker keys the bucket on `CF-Connecting-IP`, fails open when the
binding is missing or throws, and answers a refused request with `429` and
`Retry-After`. Change `namespaceId` to a value that is unique in your Cloudflare
account.

## Telemetry

Sentry records errors, traces, and profiles. The browser starts it in
`apps/karir/src/platform/sentry.ts`; both Workers wrap their entries with
`Sentry.withSentry`. The Workers need `nodejs_compat`, which
`sentryCompatibility` sets. `services/karir/src/handler.ts` provides the Effect
error reporter, tracer, and logger, so a span from a context becomes a Sentry
span. `ApiError` is a declared answer and stays out of the issue stream.

Cloudflare Workers Observability keeps logs only, sampled at 0.1. Traces are off
so a request is traced once. Set `VITE_SENTRY_DSN` and `VITE_SENTRY_RELEASE` to
turn Sentry on; without a DSN the browser and both Workers run with the SDK off.
`SENTRY_AUTH_TOKEN` uploads hidden source maps from the build.

The browser sends trace headers to `/api/karir/` only. The website Worker passes
them through the service binding, so one trace covers the browser, both Workers,
and the API handler.

## Code ownership

- `apps/karir/src/app` owns the Foldkit application. Remote data belongs in
  Foldkit Query submodels. Update handlers decide when to load or revalidate
  them. `apps/karir/src/platform` owns the RPC client and the browser Sentry
  setup.
- `services/karir/src/contexts` is the home for server-side bounded contexts as
  product vocabulary is discovered. Do not pre-invent product domains in the
  scaffold.
- `services/karir/src/platform` owns host adapters: D1 queries, Durable Objects,
  R2 reads, and the structural types they expose.
- `services/karir/src/handler.ts` owns RPC composition and the Sentry Effect
  layers. `services/karir/src/worker.ts` is the runtime entry that wraps the
  handler with Sentry and the rate limiter.
- `packages/rpc` owns the public wire contract only, organized per module under
  `src/<module>`: Effect RPC groups, request/response schemas, declared errors,
  and path prefixes. Import through `@nata/rpc/<module>`.

## Dependency direction

```text
apps/karir     ─────────► @nata/rpc/karir
services/karir ─────────► @nata/rpc/karir
```

Browser apps must not import `services/` implementation modules. The RPC package
must not import apps or services. A service context must not import
`services/<module>/src/platform`; it depends on its own store interface. Share
the wire contract and the store interface, not internal models.

## Cloudflare scope

The initial stack provisions the karir website Worker and API Worker. Add D1,
R2, Access, Durable Objects, or other Cloudflare services only when a product
feature requires them. The example API returns a small static status response
and does not imply a persistence choice. [Recipes](recipes.md) shows the D1
path end to end.
