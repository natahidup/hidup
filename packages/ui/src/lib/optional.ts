/**
 * Build a partial object that omits keys whose values are `undefined`.
 * Required under `exactOptionalPropertyTypes` when forwarding optional config
 * into `@foldkit/ui` view helpers.
 */
export const defined = <T extends Record<string, unknown>>(
  input: T,
): { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>
} => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value
  }
  return out as never
}
