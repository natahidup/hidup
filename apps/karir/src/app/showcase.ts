import { Effect, Schema } from 'effect'
import * as Command from 'foldkit/command'
import type { Document, Html, HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { modifyFields } from 'foldkit/struct'
import type { Commands, Return as UpdateReturn } from 'foldkit/update'
import { badge, button, Card, icon, input, label, skeleton, X } from '@nata/ui'
import * as Dialog from '@nata/ui/components/ui/dialog'
import * as Menu from '@nata/ui/components/ui/menu'
import * as Toast from '@nata/ui/components/ui/toast'

const ShowcaseToast = Toast.make(Schema.Struct({ title: Schema.String }))
type ShowcaseToastMessage = typeof ShowcaseToast.Message.Type

const ActionMenu = Menu.create<'Profile' | 'Settings' | 'Sign out'>()

export const Model = Schema.Struct({
  dark: Schema.Boolean,
  name: Schema.String,
  dialog: Dialog.Model,
  menu: Menu.Model,
  toast: ShowcaseToast.Model,
})
export type Model = typeof Model.Type

export const Message = defineMessageUnion({
  ThemeApplied: {},
  ClickedToggleTheme: {},
  TypedName: { value: Schema.String },
  ClickedOpenDialog: {},
  GotDialogMessage: { message: Dialog.Message },
  GotMenuMessage: { message: Menu.Message },
  GotToastMessage: { message: ShowcaseToast.Message },
  ClickedShowToast: {},
})
export type Message = typeof Message.Type

const ApplyTheme = Command.define('ApplyTheme', {
  args: { dark: Schema.Boolean },
  messages: [Message.ThemeApplied],
  execute: ({ dark }) =>
    Effect.sync(() => {
      document.documentElement.classList.toggle('dark', dark)
    }).pipe(Effect.as(Message.ThemeApplied())),
})

const mapDialogCommands = (commands: Commands<Dialog.Message> | undefined) =>
  Command.mapMessages(commands ?? [], (dialogMessage) =>
    Message.GotDialogMessage({ message: dialogMessage }),
  )

const mapMenuCommands = (commands: Commands<Menu.Message> | undefined) =>
  Command.mapMessages(commands ?? [], (menuMessage) =>
    Message.GotMenuMessage({ message: menuMessage }),
  )

const mapToastCommands = (commands: Commands<ShowcaseToastMessage> | undefined) =>
  Command.mapMessages(commands ?? [], (toastMessage) =>
    Message.GotToastMessage({ message: toastMessage }),
  )

export const init = (): UpdateReturn<Model, Message> => ({
  model: Model.make({
    dark: false,
    name: '',
    dialog: Dialog.init({ id: 'showcase-dialog' }),
    menu: Menu.init({ id: 'showcase-menu' }),
    toast: ShowcaseToast.init({ id: 'showcase-toast' }),
  }),
  commands: [ApplyTheme({ dark: false })],
})

export const update = (model: Model, message: Message): UpdateReturn<Model, Message> =>
  Message.match(message, {
    ThemeApplied: () => ({ model }),
    ClickedToggleTheme: () => {
      const dark = !model.dark
      return {
        model: modifyFields(model, { dark: () => dark }),
        commands: [ApplyTheme({ dark })],
      }
    },
    TypedName: ({ value }) => ({
      model: modifyFields(model, { name: () => value }),
    }),
    ClickedOpenDialog: () => {
      const { model: next, commands } = Dialog.open(model.dialog)
      return {
        model: modifyFields(model, { dialog: () => next }),
        commands: mapDialogCommands(commands),
      }
    },
    GotDialogMessage: ({ message: dialogMessage }) => {
      const { model: next, commands } = Dialog.update(model.dialog, dialogMessage)
      return {
        model: modifyFields(model, { dialog: () => next }),
        commands: mapDialogCommands(commands),
      }
    },
    GotMenuMessage: ({ message: menuMessage }) => {
      const { model: next, commands } = ActionMenu.update(model.menu, menuMessage)
      return {
        model: modifyFields(model, { menu: () => next }),
        commands: mapMenuCommands(commands),
      }
    },
    GotToastMessage: ({ message: toastMessage }) => {
      const { model: next, commands } = ShowcaseToast.update(model.toast, toastMessage)
      return {
        model: modifyFields(model, { toast: () => next }),
        commands: mapToastCommands(commands),
      }
    },
    ClickedShowToast: () => {
      const shown = ShowcaseToast.show(model.toast, {
        variant: 'Info',
        payload: { title: 'Nata UI toast' },
      })
      return {
        model: modifyFields(model, { toast: () => shown.model }),
        commands: mapToastCommands(shown.commands),
      }
    },
  })

const section = (
  title: string,
  children: ReadonlyArray<Html | string>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class('flex flex-col gap-3')],
    [h.h2([h.Class('text-sm font-medium text-muted-foreground')], [title]), ...children],
  )

const componentPanel = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex flex-col gap-8')],
    [
      section(
        'Button',
        [
          h.div(
            [h.Class('flex flex-wrap gap-2')],
            [
              button({ onClick: Message.ClickedShowToast() }, 'Default', h),
              button({ variant: 'secondary' }, 'Secondary', h),
              button({ variant: 'outline' }, 'Outline', h),
              button({ variant: 'ghost' }, 'Ghost', h),
              button({ variant: 'destructive' }, 'Destructive', h),
              button({ variant: 'link' }, 'Link', h),
            ],
          ),
        ],
        h,
      ),
      section(
        'Input / Label',
        [
          input(
            {
              id: 'showcase-name',
              label: 'Name',
              description: 'Uses the foldcn input + label styles.',
              value: model.name,
              onInput: (value) => Message.TypedName({ value }),
              placeholder: 'Your name',
            },
            h,
          ),
          label({ forId: 'showcase-standalone' }, ['Standalone label'], h),
        ],
        h,
      ),
      section(
        'Card',
        [
          Card(
            {},
            [
              Card.header(
                {},
                [
                  Card.title({}, ['Design tokens'], h),
                  Card.description({}, ['Semantic colors from @nata/tokens.'], h),
                ],
                h,
              ),
              Card.content({}, ['Components read CSS variables only — no hardcoded colors.'], h),
              Card.footer({}, [badge({}, ['tokens'], h)], h),
            ],
            h,
          ),
        ],
        h,
      ),
      section(
        'Badge',
        [
          h.div(
            [h.Class('flex flex-wrap gap-2')],
            [
              badge({ variant: 'default' }, ['Default'], h),
              badge({ variant: 'secondary' }, ['Secondary'], h),
              badge({ variant: 'outline' }, ['Outline'], h),
              badge({ variant: 'destructive' }, ['Destructive'], h),
            ],
          ),
        ],
        h,
      ),
      section(
        'Skeleton',
        [
          h.div(
            [h.Class('flex flex-col gap-2')],
            [
              skeleton({ className: 'h-4 w-2/3' }, [], h),
              skeleton({ className: 'h-4 w-1/2' }, [], h),
            ],
          ),
        ],
        h,
      ),
      section(
        'Dialog',
        [
          button({ variant: 'outline', onClick: Message.ClickedOpenDialog() }, 'Open dialog', h),
          h.submodel({
            slotId: model.dialog.id,
            model: model.dialog,
            view: Dialog.view,
            viewInputs: Dialog.styledViewInputs(
              {
                hasDescription: true,
                content: ({ closeButton, title, description }, dialogH) => [
                  Dialog.header(
                    {},
                    [
                      Dialog.title({ attributes: title }, ['Showcase dialog'], dialogH),
                      Dialog.description(
                        { attributes: description },
                        ['Wired through @nata/ui Dialog.'],
                        dialogH,
                      ),
                    ],
                    dialogH,
                  ),
                  Dialog.closeButton(
                    { attributes: closeButton },
                    [icon(dialogH, X, 'size-4')],
                    dialogH,
                  ),
                  Dialog.footer({}, [dialogH.p([dialogH.Class('text-sm')], ['Ready.'])], dialogH),
                ],
              },
              h,
            ),
            toParentMessage: (dialogMessage) =>
              Message.GotDialogMessage({ message: dialogMessage }),
          }),
        ],
        h,
      ),
      section(
        'Menu',
        [
          h.submodel({
            slotId: model.menu.id,
            model: model.menu,
            view: ActionMenu.view,
            viewInputs: Menu.viewInputs({
              items: ['Profile', 'Settings', 'Sign out'],
              buttonContent: h.span([], ['Open menu']),
              itemToConfig: (item) => ({ content: h.span([], [item]) }),
            }),
            toParentMessage: (menuMessage) => Message.GotMenuMessage({ message: menuMessage }),
          }),
        ],
        h,
      ),
      section(
        'Toast',
        [
          button({ onClick: Message.ClickedShowToast() }, 'Show toast', h),
          h.submodel({
            slotId: model.toast.id,
            model: model.toast,
            view: ShowcaseToast.view,
            viewInputs: ShowcaseToast.styledViewInputs(
              model.toast,
              {
                position: 'BottomRight',
                toContent: (entry, toastH) => [
                  toastH.div(
                    [toastH.Class('flex items-start gap-2')],
                    [
                      Toast.toastIcon(toastH, entry.variant),
                      toastH.p([toastH.Class('text-sm font-medium')], [entry.payload.title]),
                    ],
                  ),
                ],
              },
              h,
            ),
            toParentMessage: (toastMessage) => Message.GotToastMessage({ message: toastMessage }),
          }),
        ],
        h,
      ),
    ],
  )

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: 'Nata UI · Showcase',
  body: h.main(
    [h.Class('min-h-screen bg-background text-foreground')],
    [
      h.header(
        [
          h.Class(
            'sticky top-0 z-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur',
          ),
        ],
        [
          h.div(
            [h.Class('mx-auto flex max-w-3xl items-center justify-between gap-3')],
            [
              h.div(
                [h.Class('flex flex-col')],
                [
                  h.p(
                    [h.Class('text-xs font-medium tracking-wide text-muted-foreground')],
                    ['INTERNAL'],
                  ),
                  h.h1([h.Class('text-lg font-semibold tracking-tight')], ['Nata UI showcase']),
                ],
              ),
              button(
                { variant: 'outline', size: 'sm', onClick: Message.ClickedToggleTheme() },
                model.dark ? 'Light' : 'Dark',
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class('mx-auto flex max-w-3xl flex-col gap-10 px-4 py-8')],
        [
          h.p(
            [h.Class('text-sm text-muted-foreground')],
            [
              'Mobile-first gallery of @nata/ui. Light and dark panels below; use the toggle for a full-page theme.',
            ],
          ),
          h.section(
            [h.Class('rounded-xl border border-border bg-background p-4 sm:p-6')],
            [h.h2([h.Class('mb-4 text-base font-semibold')], ['Light']), componentPanel(model, h)],
          ),
          h.section(
            [
              h.Class(
                'dark rounded-xl border border-border bg-background p-4 text-foreground sm:p-6',
              ),
            ],
            [h.h2([h.Class('mb-4 text-base font-semibold')], ['Dark']), componentPanel(model, h)],
          ),
        ],
      ),
    ],
  ),
})
