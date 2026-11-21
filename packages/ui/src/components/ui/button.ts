import { Button as FoldkitButton } from '@foldkit/ui'
import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { defined } from '../../lib/optional.ts'
import { cn } from '../../lib/utils.ts'

/** Button variant keys. Sync with `buttonVariants` is compiler-enforced:
 *  `buttonVariants` is `Record<ButtonVariant, string>` (missing key = error)
 *  and annotated object literals reject unknown keys. */
export const buttonVariantKeys = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'tertiary',
  'ghost',
  'link',
] as const

export const buttonVariants: Record<ButtonVariant, string> = {
  /** Solid indigo — no border, no shadow. */
  default: 'border-0 bg-primary text-primary-foreground shadow-none hover:bg-primary-hover',
  destructive:
    'border-0 bg-destructive text-destructive-foreground shadow-none hover:bg-destructive/90',
  outline: 'border border-border bg-secondary text-secondary-foreground shadow-none hover:bg-muted',
  secondary:
    'border border-border bg-secondary text-secondary-foreground shadow-none hover:bg-muted',
  /** Indigo mono uppercase text, no box. */
  tertiary: 'border-0 bg-transparent text-primary shadow-none hover:text-primary-hover',
  ghost: 'border-0 shadow-none hover:bg-muted hover:text-foreground',
  link: 'border-0 bg-transparent text-primary shadow-none underline-offset-4 hover:underline',
}

export type ButtonVariant = (typeof buttonVariantKeys)[number]

/** Button size keys. Sync with `buttonSizes` is compiler-enforced (see above). */
export const buttonSizeKeys = [
  'default',
  'xs',
  'sm',
  'lg',
  'icon',
  'icon-xs',
  'icon-sm',
  'icon-lg',
] as const

export const buttonSizes: Record<ButtonSize, string> = {
  /** Default primary control height is 48px. */
  default:
    "h-12 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-6",
  xs: "h-8 gap-1 rounded-[var(--radius-chip)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-4",
  sm: "h-10 gap-1.5 rounded-[var(--radius)] px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-5",
  lg: "h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-6",
  icon: "size-12 [&_svg:not([class*='size-'])]:size-6",
  'icon-xs': "size-8 rounded-[var(--radius-chip)] [&_svg:not([class*='size-'])]:size-4",
  'icon-sm': "size-10 rounded-[var(--radius)] [&_svg:not([class*='size-'])]:size-5",
  'icon-lg': "size-12 [&_svg:not([class*='size-'])]:size-6",
}

export type ButtonSize = (typeof buttonSizeKeys)[number]

const buttonBase =
  "font-mono text-sm font-bold uppercase tracking-[0.08em] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive rounded-[var(--radius)] bg-clip-padding focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-6 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors outline-none select-none shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50"

export type ButtonConfig<M> = Readonly<{
  onClick?: M
  isDisabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  isAutofocus?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  /** Extra attributes merged onto the button element (ids, handlers,
   *  popoover anchors, …). */
  attributes?: ReadonlyArray<Attribute<M>>
}>

export type ButtonLabel = Html | string | ReadonlyArray<Html | string>

/** Styled button built on the @foldkit/ui Button helper. */
export const button = <M>(config: ButtonConfig<M>, label: ButtonLabel, h: HtmlBuilder<M>): Html =>
  FoldkitButton.view<M>(
    {
      ...defined({
        onClick: config.onClick,
        isDisabled: config.isDisabled,
        type: config.type,
        isAutofocus: config.isAutofocus,
      }),
      toView: (attributes) =>
        h.button(
          [
            ...attributes.button,
            h.Class(
              cn(
                buttonBase,
                buttonVariants[config.variant ?? 'default'],
                buttonSizes[config.size ?? 'default'],
                config.className,
              ),
            ),
            h.DataAttribute('slot', 'button'),
            ...(config.attributes ?? []),
          ],
          Array.isArray(label) ? label : [label],
        ),
    },
    h,
  )
