import { isObject } from '../common/is-object'
import { isPlainObject } from '../common/is-plain-object'
import { isString } from '../common/is-string'

const NODE_TYPE_ELEMENT = 1

const DOM_PROPERTIES_TO_CHECK: Array<keyof HTMLElement> = [
  'innerHTML',
  'ownerDocument',
  'style',
  'attributes',
  'nodeValue',
]

/**
 * Check if the value is an HTML element.
 * @param value - The value to check
 * @returns `true` if the value is an HTML element, `false` otherwise
 */
export function isHtmlElement(value: unknown): value is HTMLElement {
  return (
    isObject(value) &&
    (value as HTMLElement).nodeType === NODE_TYPE_ELEMENT &&
    isString((value as HTMLElement).nodeName) &&
    !isPlainObject(value) &&
    DOM_PROPERTIES_TO_CHECK.every((property) => property in value)
  )
}
