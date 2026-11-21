import { Schema } from 'effect'
import { Runtime, Update } from 'foldkit'
import type { Document, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { modifyFields } from 'foldkit/struct'

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
    [h.Class('page')],
    [
      h.p([h.Class('eyebrow')], ['NATA · KARIR']),
      h.h1([], ['NataKarir']),
      h.p(
        [h.Class('description')],
        [
          model.ready
            ? 'NataKarir is ready for its product domains.'
            : 'This module is served under /karir with its API under /api/karir.',
        ],
      ),
      h.section(
        [h.Class('card')],
        [
          h.h2([], ['A clean starting point']),
          h.p([], ['Extend the karir RPC contract, then wire handlers in services/karir.']),
          model.ready
            ? h.p(
                [h.Class('status'), h.Role('status'), h.AriaLive('polite')],
                ['Message handled. The update function returned a new model.'],
              )
            : h.button(
                [h.Class('action'), h.Type('button'), h.OnClick(Message.ClickedContinue())],
                ['Run the update loop'],
              ),
        ],
      ),
    ],
  ),
})
