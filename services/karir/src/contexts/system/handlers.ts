import * as Effect from 'effect/Effect'
import { SystemRpc } from '@nata/rpc/karir'

export const SystemHandlers = SystemRpc.toLayer(
  Effect.succeed(
    SystemRpc.of({
      systemStatusGet: () => Effect.succeed({ message: 'The API Worker is connected.' }),
    }),
  ),
)
