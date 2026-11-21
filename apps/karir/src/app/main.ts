import { Schema } from 'effect'
import { Runtime, Update } from 'foldkit'
import type { Document, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { modifyFields } from 'foldkit/struct'
import { WEB_BASE } from '@nata/rpc/karir'
import { button } from '@nata/ui'
import { flags } from '../platform/flags.ts'

export const isShowcaseRoute = (): boolean => {
  if (!flags.uiShowcase) return false
  const path =
    typeof globalThis.location === 'object' && globalThis.location !== null
      ? globalThis.location.pathname
      : ''
  const normalized = path.replace(/\/$/, '')
  return normalized === `${WEB_BASE}/dev/ui` || normalized === '/dev/ui'
}

export const Model = Schema.Struct({ ready: Schema.Boolean })
export type Model = typeof Model.Type

export const Message = defineMessageUnion({
  ClickedContinue: {},
})
export type Message = typeof Message.Type

export const init: Runtime.ApplicationInit<Model, Message> = () => ({
  model: Model.make({ ready: false }),
})

export const update = (model: Model, message: Message) =>
  Message.match<Update.Return<Model, Message>>(message, {
    ClickedContinue: () => ({
      model: modifyFields(model, { ready: () => true }),
    }),
  })

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: 'NataKarir',
  body: h.main(
    [h.Class('mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-4 py-16')],
    [
      h.p([h.Class('font-mono text-xs tracking-[0.12em] text-muted-foreground')], ['NATA · KARIR']),
      h.h1(
        [h.Class('max-w-[14ch] text-4xl font-semibold tracking-tight sm:text-5xl')],
        ['NataKarir'],
      ),
      h.p(
        [h.Class('max-w-xl text-base text-muted-foreground')],
        [
          model.ready
            ? 'NataKarir is ready for its product domains.'
            : 'This module is served under /karir with its API under /api/karir.',
        ],
      ),
      h.section(
        [h.Class('mt-4 rounded-sm border border-border bg-card p-6 text-card-foreground')],
        [
          h.h2([h.Class('text-base font-medium')], ['A clean starting point']),
          h.p(
            [h.Class('mt-2 text-sm text-muted-foreground')],
            ['Extend the karir RPC contract, then wire handlers in services/karir.'],
          ),
          model.ready
            ? h.p(
                [
                  h.Class('mt-4 border-l-2 border-primary pl-3 font-mono text-sm text-foreground'),
                  h.Role('status'),
                  h.AriaLive('polite'),
                ],
                ['Message handled. The update function returned a new model.'],
              )
            : button(
                {
                  className: 'mt-5',
                  onClick: Message.ClickedContinue(),
                },
                'Run the update loop',
                h,
              ),
        ],
      ),
    ],
  ),
})
