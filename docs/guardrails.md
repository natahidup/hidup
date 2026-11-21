# Guardrails

These are the rules this template enforces, and how each one is checked. Change a
rule and its check in the same commit.

| Concern          | Rule                                                                                                                                                              | Check                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Host isolation   | `services/karir/src/contexts` must not import Alchemy, Cloudflare, Sentry, or `services/karir/src/platform`, and must not name Cloudflare global types.           | `services/karir/src/boundaries.test.ts`                                  |
| Browser boundary | Browser modules under `apps/karir/src` must not import `services/` or an Alchemy or Cloudflare adapter. The website Worker entry may import `@sentry/cloudflare`. | `services/karir/src/boundaries.test.ts`                                  |
| Wire contract    | Only `packages/rpc` declares RPC groups, schemas, declared errors, and path prefixes, under a per-module subdirectory.                                            | `services/karir/src/boundaries.test.ts` and architecture                 |
| Unstable APIs    | Unstable Effect APIs are allowed only in the files named by a tsconfig override.                                                                                  | `effect-tsrs diagnostics --strict` during `pnpm typecheck`               |
| Routing          | The module web base and API prefix have one definition each.                                                                                                      | `packages/rpc/src/karir/paths.ts`, imported by `alchemy.run.ts` and Vite |
| API surface      | The API Worker has no `workers.dev` URL; prod reaches it through Workers Routes and the website service binding.                                                  | `workersDev: false` and routes in `alchemy.run.ts`                       |
| Telemetry        | Only the app edges import Sentry. Contexts use `Effect.withSpan`, Cloudflare traces stay off, and `ApiError` stays out of the issue stream.                       | `services/karir/src/boundaries.test.ts` and review                       |
| Rate limits      | The karir API Worker limits each IP and fails open when the limiter is missing or down.                                                                           | `services/karir/src/worker.test.ts`                                      |
| Dependencies     | Effect has one version. `typescript` is not installed; `tsrs` and `effect-tsrs` are the only type checkers, and Vite+ is the only linter.                         | `package.json`, `pnpm-workspace.yaml`, and review                        |
| Deploy           | Deployment changes Cloudflare infrastructure. The deploy workflow is manual and `pnpm deploy` is not part of routine verification.                                | Review of `.github/workflows/deploy.yml` and `AGENTS.md`                 |

## Unstable API allowances

`effect-tsrs` fails typecheck when code calls an Effect API marked
`@stability unstable`. A tsconfig override grants the exception per file. The
karir service allows `effect/rpc`, `effect/http`, and `effect/ErrorReporter` in
the composition root, Worker entry, and Worker test:

```json
{
  "include": ["src/handler.ts", "src/worker.ts", "src/worker.test.ts"],
  "options": {
    "allowedUnstableApis": ["effect/rpc", "effect/http", "effect/ErrorReporter"]
  }
}
```

`apps/karir` allows `effect/rpc` in `src/platform/**/*.ts` only, where its RPC
client lives.

Add an allowance only when the unstable call is the point of the file, and keep
the pattern narrow. Contexts and UI code have no allowance, so unstable Effect
APIs cannot reach them by accident.

`pnpm install` runs `prepare`, which installs the Git hooks. Effect diagnostics
run in `pnpm typecheck`, after `tsrs`; they are not patched into Oxlint, so
`vp lint` and `vp check` stay on Vite+'s tsrs backend.

## Review checklist

Before you call a change done:

- Does the change extend the module wire contract instead of starting a second
  package?
- Does every handler stay free of bindings and platform types?
- Does a context depend on its own store interface instead of importing a
  platform adapter?
- Does a context stay free of Sentry, D1, and Worker types?
- Does the browser import only `@nata/rpc/<module>`, never `services/`?
- Does the rate limiter fail open when its binding is missing or throws?
- Does each new endpoint have a test that crosses the RPC path?
- Did you edit an allowlist, and is the new entry as narrow as the code needs?
- Do failures use `ApiError` with `Effect.fail` instead of a thrown value?
- Do `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass?
