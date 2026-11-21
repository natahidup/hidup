import * as Cloudflare from '@alchemy.run/cloudflare'
import { sentryRollupPlugin } from '@sentry/rollup-plugin'
import * as Alchemy from 'alchemy'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { API_PREFIX, WEB_BASE } from '@nata/rpc/karir'

const compatibility = { date: '2026-10-08' }
// The Sentry SDK in the API and website Workers needs AsyncLocalStorage, which
// `nodejs_compat` gives.
const sentryCompatibility = { ...compatibility, flags: ['nodejs_compat'] }

/**
 * Sentry is optional. The browser inlines the DSN at build time; the Workers
 * get it as a plain-text binding. A stage without a DSN ships with Sentry off.
 * `VITE_SENTRY_RELEASE` (the commit) is the release all three report.
 */
const sentryDsn = process.env.VITE_SENTRY_DSN ?? ''
const sentryRelease = process.env.VITE_SENTRY_RELEASE ?? ''
const sentryEnv = {
  ...(sentryDsn && { SENTRY_DSN: sentryDsn }),
  ...(sentryRelease && { SENTRY_RELEASE: sentryRelease }),
}

/**
 * Source maps for the API Worker. The website build uploads its own through the
 * Sentry plugin in `apps/karir/vite.config.ts`. Both need `SENTRY_AUTH_TOKEN`, and
 * read `SENTRY_ORG` and `SENTRY_PROJECT` from the environment. Without all three,
 * nothing uploads.
 */
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const sentryUpload =
  sentryAuthToken !== undefined &&
  process.env.SENTRY_ORG !== undefined &&
  process.env.SENTRY_PROJECT !== undefined
const apiBuild = {
  build: {
    input: {
      plugins: sentryUpload
        ? [
            sentryRollupPlugin({
              authToken: sentryAuthToken,
              ...(sentryRelease ? { release: { name: sentryRelease } } : {}),
            }),
          ]
        : [],
    },
  },
}

/**
 * Per-IP limits on the karir API Worker. Requests may arrive through the
 * website service binding (local) or the /api/karir* Workers Route (prod). A
 * single module rarely makes more than a handful of API calls a minute. Change
 * the namespace ID to a value that is unique in your Cloudflare account.
 */
const rateLimits = {
  RATE_LIMIT_API: Cloudflare.RateLimit('RateLimitApi', {
    namespaceId: 7401,
    simple: { limit: 60, period: 60 },
  }),
}

/**
 * Cloudflare Workers Observability, configured on the host resources only.
 * Sampling at 0.1 keeps one request in ten, enough for a starter and a launch
 * spike. Sentry owns traces, so Cloudflare's are off: they would record every
 * request a second time. Raise the log rate while you debug a specific request.
 */
const observability = {
  enabled: true,
  headSamplingRate: 0.1,
  logs: { enabled: true, invocationLogs: true, headSamplingRate: 0.1, persist: true },
  traces: { enabled: false },
}

const state = Layer.unwrap(
  Effect.gen(function* () {
    const dev = yield* Alchemy.ALCHEMY_DEV.pipe(Effect.orDie)
    return dev ? Alchemy.localState() : Cloudflare.state()
  }),
)

export default Alchemy.Stack(
  'nata',
  { providers: Cloudflare.providers(), state },
  Effect.gen(function* () {
    const stage = yield* Alchemy.Stack.use((stack) => Effect.succeed(stack.stage))
    const zoneName = 'natahidup.app'
    // Path routes for the Nata super app. Patterns use a trailing `*` so
    // /karir and /api/karir match without requiring a slash (Alchemy federated
    // APIs). Attach only on prod; local alchemy keeps the service binding.
    const karirWebRoutes =
      stage === 'prod' ? [{ pattern: `${zoneName}${WEB_BASE}*`, zoneName }] : undefined
    const karirApiRoutes =
      stage === 'prod' ? [{ pattern: `${zoneName}${API_PREFIX}*`, zoneName }] : undefined

    const KarirApi = Cloudflare.Worker('KarirApi', {
      main: './services/karir/src/worker.ts',
      // A stable local URL for the service binding. The website takes 5173.
      dev: { port: 1337 },
      env: { ...sentryEnv, ...rateLimits },
      ...apiBuild,
      compatibility: sentryCompatibility,
      observability,
      ...(karirApiRoutes ? { routes: karirApiRoutes } : {}),
      // Locally the website reaches the API through its service binding. In
      // production, Workers Routes also send /api/karir* here directly.
      workersDev: false,
    })
    const KarirWebsite = Cloudflare.Website.Foldkit('KarirWebsite', {
      rootDir: 'apps/karir',
      main: 'src/worker.ts',
      dev: { port: 5173 },
      env: { API: KarirApi, ...sentryEnv },
      assets: { runWorkerFirst: [`${API_PREFIX}/*`] },
      compatibility: sentryCompatibility,
      observability,
      ...(karirWebRoutes ? { routes: karirWebRoutes } : {}),
    })

    yield* KarirApi
    const website = yield* KarirWebsite
    return { url: website.url }
  }),
)
