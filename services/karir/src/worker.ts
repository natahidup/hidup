import * as Sentry from '@sentry/cloudflare'
import { handler, type Env, type RateLimitBinding } from './handler.ts'

export type { Env }

/** A limiter that fails open: an outage in the rate limiter must not stop the app. */
const allowed = async (binding: RateLimitBinding | undefined, key: string): Promise<boolean> => {
  if (binding === undefined) return true
  try {
    return (await binding.limit({ key })).success
  } catch {
    return true
  }
}

const tooMany = (): Response =>
  new Response('Too many requests. Try again in a minute.', {
    status: 429,
    headers: { 'Retry-After': '60', 'Content-Type': 'text/plain; charset=utf-8' },
  })

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
    // Sentry owns traces; Cloudflare Workers Observability keeps logs only (see `alchemy.run.ts`).
    // A request follows the browser's choice; one without a trace header is sampled on its own.
    tracesSampler: ({ parentSampled }) => parentSampled ?? 0.1,
    initialScope: { tags: { service: 'karir-api-worker' } },
  }),
  {
    // The incoming request carries the browser's trace headers. The service binding passes the
    // same headers on, so one trace covers the browser, the website Worker, and the API Worker.
    async fetch(request: Request, env: Env): Promise<Response> {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
      if (!(await allowed(env.RATE_LIMIT_API, ip))) return tooMany()
      return handler.handler(request)
    },
  },
)
