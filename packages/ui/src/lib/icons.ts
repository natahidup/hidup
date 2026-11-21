import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'
import type { IconAttrs, IconNode } from './phosphor.ts'

/**
 * Render a Phosphor icon as Foldkit virtual DOM.
 *
 * Icon nodes come from `@phosphor-icons/core` regular SVGs (see `phosphor.ts`).
 * Do not add lucide — use Phosphor equivalents instead.
 *
 * ```ts
 * import { icon } from '@nata/ui/lib/icons'
 * import { ChevronDown } from '@nata/ui/lib/phosphor'
 *
 * icon(h, ChevronDown)
 * icon(h, ChevronDown, 'size-3')
 * ```
 */

const svgElement =
  <M>(tag: string, h: HtmlBuilder<M>) =>
  (attributes: ReadonlyArray<Attribute<M> | ChildAttribute>): Html => {
    switch (tag) {
      case 'path':
        return h.path(attributes)
      case 'circle':
        return h.circle(attributes)
      case 'rect':
        return h.rect(attributes)
      case 'line':
        return h.line(attributes)
      case 'polyline':
        return h.polyline(attributes)
      case 'polygon':
        return h.polygon(attributes)
      default:
        return h.path(attributes)
    }
  }

const svgAttributes = <M>(
  className: string,
  h: HtmlBuilder<M>,
): ReadonlyArray<Attribute<M> | ChildAttribute> => [
  h.AriaHidden(true),
  h.Class(className),
  h.Xmlns('http://www.w3.org/2000/svg'),
  h.ViewBox('0 0 256 256'),
  h.Fill('currentColor'),
]

const nodeToAttributes = <M>(
  attrs: IconAttrs,
  h: HtmlBuilder<M>,
): ReadonlyArray<Attribute<M> | ChildAttribute> =>
  Object.entries(attrs).map(([name, value]) => h.Attribute(name, String(value)))

const defaultIconClass = 'size-4 shrink-0'

export type IconPosition = 'inline-start' | 'inline-end'

export const icon = <M>(
  h: HtmlBuilder<M>,
  node: IconNode,
  className = defaultIconClass,
  position?: IconPosition,
): Html =>
  h.svg(
    [...svgAttributes(className, h), ...(position ? [h.DataAttribute('icon', position)] : [])],
    node.map(([tag, attrs]) => svgElement(tag, h)(nodeToAttributes(attrs, h))),
  )
