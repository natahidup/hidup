import { Input as FoldkitInput } from '@foldkit/ui'
import type { Html, HtmlBuilder } from 'foldkit/html'

import { defined } from '../../lib/optional.ts'
import { cn } from '../../lib/utils.ts'

/**
 * Brand field shell: parchment surface, stone border, 4px radius, ~56px tall.
 * Label (mono uppercase) sits above the value inside the same box.
 */
export const inputFieldClass =
  'flex min-h-14 w-full flex-col justify-center gap-0.5 rounded-[var(--radius)] border border-border bg-card px-3 py-2 transition-colors focus-within:border-ring group-data-[invalid]/field:border-destructive group-data-[disabled]/field:opacity-50'

/** 11px Space Mono uppercase label inside the field. */
export const inputLabelClass =
  'font-mono text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-muted-foreground select-none group-data-[disabled]/field:pointer-events-none group-data-[disabled]/field:cursor-not-allowed'

/** 16px Space Grotesk value / placeholder. */
export const inputClass =
  'w-full min-w-0 border-0 bg-transparent p-0 font-sans text-base leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground'

export const inputDescriptionClass = 'text-sm leading-5 text-muted-foreground'

export const inputErrorClass = 'text-sm leading-5 text-destructive'

export const inputWrapperClass = 'group/field flex w-full flex-col gap-1.5'

export type InputConfig<M> = Readonly<{
  id: string
  label: string
  description?: string
  /** Shown below the field when `isInvalid` is true. */
  error?: string
  onInput?: (value: string) => M
  value?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isInvalid?: boolean
  isAutofocus?: boolean
  name?: string
  type?: string
  placeholder?: string
  className?: string
  labelClass?: string
  descriptionClass?: string
  errorClass?: string
  fieldClass?: string
  wrapperClass?: string
}>

/** Styled text input with in-box label, built on the @foldkit/ui Input helper. */
export const input = <M>(config: InputConfig<M>, h: HtmlBuilder<M>): Html =>
  FoldkitInput.view<M>(
    {
      id: config.id,
      hasDescription: config.description !== undefined || config.error !== undefined,
      ...defined({
        onInput: config.onInput,
        value: config.value,
        isDisabled: config.isDisabled,
        isReadOnly: config.isReadOnly,
        isInvalid: config.isInvalid,
        isAutofocus: config.isAutofocus,
        name: config.name,
        type: config.type,
        placeholder: config.placeholder,
      }),
      toView: (attributes) => {
        const showError = config.isInvalid === true && config.error !== undefined
        const helper = showError
          ? h.span(
              [
                ...attributes.description,
                h.Class(cn(inputErrorClass, config.errorClass)),
                h.Role('alert'),
              ],
              [config.error!],
            )
          : config.description === undefined
            ? h.empty
            : h.span(
                [
                  ...attributes.description,
                  h.Class(cn(inputDescriptionClass, config.descriptionClass)),
                ],
                [config.description],
              )

        return h.div(
          [
            h.Class(cn(inputWrapperClass, config.wrapperClass)),
            ...(config.isDisabled ? [h.DataAttribute('disabled', '')] : []),
            ...(config.isInvalid ? [h.DataAttribute('invalid', '')] : []),
          ],
          [
            h.div(
              [h.Class(cn(inputFieldClass, config.fieldClass)), h.DataAttribute('slot', 'field')],
              [
                h.label(
                  [
                    ...attributes.label,
                    h.DataAttribute('slot', 'label'),
                    h.Class(cn(inputLabelClass, config.labelClass)),
                  ],
                  [config.label],
                ),
                h.input([
                  ...attributes.input,
                  h.DataAttribute('slot', 'input'),
                  h.Class(cn(inputClass, config.className)),
                ]),
              ],
            ),
            helper,
          ],
        )
      },
    },
    h,
  )
