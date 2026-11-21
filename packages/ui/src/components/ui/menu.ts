/** Stateful submodel — import the whole module as a namespace and wire its
 *  Model/Message/init/update into your app:
 *  `import * as Menu from '@nata/ui/components/ui/menu'`
 */
import { Menu as FoldkitMenu } from '@foldkit/ui'
import type { AnchorConfig } from '@foldkit/ui/menu'
import { childAttributes, inertHtml, type Html, type HtmlBuilder } from 'foldkit/html'
import { Check, ChevronRight } from '../../lib/phosphor.ts'

import { icon } from '../../lib/icons.ts'
import { defined } from '../../lib/optional.ts'
import { cn } from '../../lib/utils.ts'

// Re-export the @foldkit/ui Menu surface. Create a bundle once per item type:
//
//   export const ActionMenu = Menu.create<"Edit" | "Delete">()
//
// foldkit deltas: items highlight via data-active (upstream uses focus:) —
// prefix adjusted per docs/deriving-from-base.md; the panel's data-side is
// emitted here from the anchor placement (foldkit anchors expose placement,
// not side). The primitive's item config is `{ className, content }` with a
// single flat level, so item kinds are foldcn-owned:
//   - destructive / inset: `menuItemDestructiveClass` / `menuItemInsetClass`
//     (cn-compat tokens; the row cannot carry data-variant / data-inset).
//   - checkbox / radio: render `menuItemIndicator` inside the row. The
//     primitive closes on every `SelectedItem`, so keep the panel open by
//     handling that message yourself (apply your toggle, do not forward it to
//     `update`) — the menu never closes, animated or not.
//   - submenu: nest a second bundle inside the parent row, built with
//     `subViewInputs`; the consumer slice coordinates open/close and keys.
// Per-item data-slot (dropdown-menu-item etc) cannot be stamped — the primitive
// has no per-item attribute hook. Sub-trigger uses data-popup-open per upstream
// but foldkit emits data-open — compat via cn-compat.css.

export const create = FoldkitMenu.create
export const init = (config: InitConfig): Model => FoldkitMenu.init({ isAnimated: true, ...config })
export const buttonId = FoldkitMenu.buttonId
export const Model = FoldkitMenu.Model
export type Model = typeof Model.Type
export const Message = FoldkitMenu.Message
export type Message = typeof Message.Type
export const OutMessage = FoldkitMenu.OutMessage
export type OutMessage = typeof OutMessage.Type

export type Bundle<Item extends string = string> = FoldkitMenu.Bundle<Item>
export type InitConfig = FoldkitMenu.InitConfig
export type ViewInputs<Item extends string = string> = FoldkitMenu.ViewInputs<Item>
export type ItemConfig = FoldkitMenu.ItemConfig
export type GroupHeading = FoldkitMenu.GroupHeading

/** Upstream renders DropdownMenuTrigger unstyled (consumers pass a Button);
 *  foldcn's trigger builder keeps a ghost-button composition. */
export const menuTriggerClass =
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"

export const menuItemsClass =
  'data-enter:animate-in data-leave:animate-out data-leave:fade-out-0 data-enter:fade-in-0 data-leave:zoom-out-95 data-enter:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 text-popover-foreground min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100 not-data-[side=bottom]:data-[placement=bottom]:slide-in-from-top-2 not-data-[side=left]:data-[placement=left]:slide-in-from-right-2 not-data-[side=right]:data-[placement=right]:slide-in-from-left-2 not-data-[side=top]:data-[placement=top]:slide-in-from-bottom-2 [--anchor-width:var(--button-width)] data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 animate-none! relative before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground! bg-popover z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden'

export const menuItemsAnimatedClass = menuItemsClass

export const menuItemClass =
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-active:bg-accent data-active:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"

export const menuSeparatorClass = 'bg-border -mx-1 my-1 h-px'

export const menuHeadingClass =
  'text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7'

export const menuShortcutClass =
  'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest group-data-active/dropdown-menu-item:text-accent-foreground'

export const menuLabelClass = menuHeadingClass

export const menuSubTriggerClass =
  "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 data-open:bg-accent data-open:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-active:bg-accent data-active:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"

/** Highlight for the parent row while its submenu is open (upstream keys this
 *  on the trigger's `data-popup-open`). */
export const menuSubTriggerOpenClass = 'bg-accent text-accent-foreground'

/** Upstream `DropdownMenuSubContent` string (the nested panel). */
export const menuSubContentClass =
  'data-enter:animate-in data-leave:animate-out data-leave:fade-out-0 data-enter:fade-in-0 data-leave:zoom-out-95 data-enter:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 text-popover-foreground min-w-[96px] rounded-lg p-1 shadow-lg ring-1 duration-100 animate-none! relative before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground! bg-popover z-50 max-h-(--available-height) w-auto origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden'

/** Row className for upstream `variant="destructive"`. */
export const menuItemDestructiveClass =
  'text-destructive data-active:bg-destructive/10 data-active:text-destructive dark:data-active:bg-destructive/20 [&_svg]:text-destructive!'

/** Row className for upstream `inset`. */
export const menuItemInsetClass = 'pl-7'

/** Upstream `DropdownMenuItemIndicator` (right-aligned check). */
export const menuItemIndicatorClass =
  'absolute right-2 flex items-center justify-center pointer-events-none'

export const menuCheckboxItemClass =
  "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 data-active:bg-accent data-active:text-accent-foreground relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"

export const menuRadioItemClass =
  "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 data-active:bg-accent data-active:text-accent-foreground relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"

/** Check indicator for a checkbox or radio row: render it inside the row's
 *  `content` (empty when unchecked) and give the row `menuCheckboxItemClass` /
 *  `menuRadioItemClass`. */
export const menuItemIndicator = <M>(h: HtmlBuilder<M>, isChecked: boolean): Html =>
  h.span(
    [h.Class(menuItemIndicatorClass), h.DataAttribute('slot', 'dropdown-menu-item-indicator')],
    isChecked ? [icon(h, Check)] : [],
  )

/** Trailing chevron for a submenu trigger row. */
export const menuSubTriggerChevron = <M>(h: HtmlBuilder<M>): Html =>
  icon(h, ChevronRight, 'rtl:rotate-180 ml-auto size-4')

export const menuBackdropClass = 'fixed inset-0 z-0'

export const menuWrapperClass = 'relative inline-block'

export const MENU_ANCHOR: AnchorConfig = {
  placement: 'bottom-start',
  gap: 4,
  padding: 8,
}

export type MenuViewInputsConfig<Item extends string> = Readonly<{
  items: ReadonlyArray<Item>
  itemToConfig: ViewInputs<Item>['itemToConfig']
  buttonContent: Html
  anchor?: AnchorConfig
  isItemDisabled?: (item: Item, index: number) => boolean
  itemToSearchText?: (item: Item, index: number) => string
  isButtonDisabled?: boolean
  isAnimated?: boolean
  itemGroupKey?: (item: Item, index: number) => string
  groupToHeading?: (groupKey: string) => GroupHeading | undefined
  triggerClass?: string
  itemsClass?: string
  itemClass?: string
  backdropClass?: string
  wrapperClass?: string
  separatorClass?: string
  groupClass?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  /** Extra attributes for the trigger and the panel. Build them with
   *  `childAttributes` so handlers dispatch through your own update (used for
   *  submenu ArrowRight/ArrowLeft coordination). */
  triggerAttributes?: ViewInputs<Item>['buttonAttributes']
  contentAttributes?: ViewInputs<Item>['itemsAttributes']
}>

/** Build styled `Menu.ViewInputs` with foldcn's classes baked in. */
export const viewInputs = <Item extends string>(
  config: MenuViewInputsConfig<Item>,
): ViewInputs<Item> => {
  // Upstream slide-in variants key on data-side; foldkit anchors expose
  // placement ("bottom-start"), so derive the physical side here.
  const anchor = config.anchor ?? MENU_ANCHOR
  const side = (anchor.placement ?? 'bottom').split('-')[0] || 'bottom'
  return {
    items: config.items,
    anchor,
    ...defined({
      isItemDisabled: config.isItemDisabled,
      itemToSearchText: config.itemToSearchText,
      isButtonDisabled: config.isButtonDisabled,
      buttonContent: config.buttonContent,
      itemGroupKey: config.itemGroupKey,
      groupToHeading: config.groupToHeading
        ? (groupKey: string) => {
            const heading = config.groupToHeading!(groupKey)
            if (!heading) return undefined
            return {
              content: heading.content,
              className: cn(menuHeadingClass, heading.className),
            }
          }
        : undefined,
      ariaLabel: config.ariaLabel,
      ariaLabelledBy: config.ariaLabelledBy,
      groupClassName: config.groupClass,
    }),
    buttonClassName: cn(menuTriggerClass, config.triggerClass),
    buttonAttributes: [
      ...childAttributes([inertHtml.DataAttribute('slot', 'dropdown-menu-trigger')]),
      ...(config.triggerAttributes ?? []),
    ],
    itemsClassName: cn(
      config.isAnimated !== false ? menuItemsAnimatedClass : menuItemsClass,
      config.itemsClass,
    ),
    itemsAttributes: [
      ...childAttributes([
        inertHtml.DataAttribute('slot', 'dropdown-menu-content'),
        inertHtml.DataAttribute('side', side),
      ]),
      ...(config.contentAttributes ?? []),
    ],
    itemToConfig: (item, context) => {
      const { className, content } = config.itemToConfig(item, context)
      return { className: cn(menuItemClass, config.itemClass, className), content }
    },
    separatorClassName: cn(menuSeparatorClass, config.separatorClass),
    separatorAttributes: childAttributes([
      inertHtml.DataAttribute('slot', 'dropdown-menu-separator'),
    ]),
    groupAttributes: childAttributes([inertHtml.DataAttribute('slot', 'dropdown-menu-group')]),
    backdropClassName: cn(menuBackdropClass, config.backdropClass),
    className: cn(menuWrapperClass, config.wrapperClass),
    attributes: childAttributes([inertHtml.DataAttribute('slot', 'dropdown-menu')]),
  }
}

// The trigger button sits inside the parent row (px-1.5) inside the parent
// panel (p-1), so the gap clears both and the offset lines the first row up with
// the trigger row (the sub panel's own p-1).
export const MENU_SUB_ANCHOR: AnchorConfig = {
  placement: 'right-start',
  gap: 14,
  offset: -8,
  padding: 8,
}

/** `viewInputs` for a nested menu, rendered as the `content` of a parent row.
 *  The trigger is a full-width, pointer-transparent button: the parent row owns
 *  the click (its `SelectedItem` message opens the submenu — handle it yourself, do not forward it) and the panel
 *  anchors to the trigger. Pair it with `menuSubTriggerClass` on the parent
 *  row's className and `menuSubTriggerChevron` in the trigger's content. */
export const subViewInputs = <Item extends string>(
  config: MenuViewInputsConfig<Item>,
): ViewInputs<Item> => {
  const inputs = viewInputs({
    anchor: MENU_SUB_ANCHOR,
    wrapperClass: 'block w-full',
    ...config,
  })
  return {
    ...inputs,
    buttonClassName: cn(
      'pointer-events-none flex w-full items-center gap-1.5',
      config.triggerClass,
    ),
    buttonAttributes: [
      ...childAttributes([
        inertHtml.DataAttribute('slot', 'dropdown-menu-sub-trigger'),
        inertHtml.Tabindex(-1),
      ]),
      ...(config.triggerAttributes ?? []),
    ],
    itemsClassName: cn(menuSubContentClass, config.itemsClass),
    itemsAttributes: [
      ...childAttributes([
        inertHtml.DataAttribute('slot', 'dropdown-menu-sub-content'),
        inertHtml.DataAttribute(
          'side',
          (config.anchor ?? MENU_SUB_ANCHOR).placement?.split('-')[0] ?? 'right',
        ),
      ]),
      ...(config.contentAttributes ?? []),
    ],
  }
}
