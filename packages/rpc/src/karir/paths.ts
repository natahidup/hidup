/**
 * Public path of the NataKarir Foldkit app on natahidup.app. Vite `base` and
 * any future Foldkit router base must stay aligned with this value.
 */
export const WEB_BASE = '/karir'

/**
 * Path prefix served by the karir API Worker. The website Worker forwards this
 * prefix through its service binding when the request hits that Worker;
 * Cloudflare Workers Routes also send `/api/karir*` to the API Worker
 * directly. `alchemy.run.ts` derives `runWorkerFirst` and zone routes from
 * these values so the contract and the deployment cannot drift apart.
 */
export const API_PREFIX = '/api/karir'

export const RPC_PATH = `${API_PREFIX}/rpc`
