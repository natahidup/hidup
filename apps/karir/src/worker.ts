import * as Sentry from '@sentry/cloudflare'

interface ApiBinding {
  fetch(request: Request): Promise<Response>
}

interface Environment {
  readonly API: ApiBinding
  /** Without a DSN the Sentry SDK stays off. */
  readonly SENTRY_DSN?: string
  readonly SENTRY_RELEASE?: string
}

/**
 * Only requests under the karir API prefix reach this module (see
 * `runWorkerFirst` in `alchemy.run.ts`). Every other /karir path is served
 * from the static assets. Rate limiting lives on the API Worker so direct
 * Workers Routes and the service-binding path share one limiter.
 */
export default Sentry.withSentry(
  (env: Environment) => ({
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
    // Only a browser trace is continued. A request without one starts none.
    tracesSampler: ({ parentSampled }) => (parentSampled ? 1 : 0),
    initialScope: { tags: { service: 'karir-website-worker' } },
  }),
  {
    // The incoming request carries the browser's trace headers. The service binding passes the
    // same headers on, so one trace covers the browser and both Workers.
    async fetch(request: Request, env: Environment): Promise<Response> {
      return env.API.fetch(request)
    },
  },
)
