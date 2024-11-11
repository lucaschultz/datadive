import type { ObjectTypeName } from './is-object-type-name'

import { isHtmlElement } from '../browser/is-html-element'
import { isObjectTypeName } from './is-object-type-name'

/**
 * Get the object type name of the given value
 * @param value - The value to get the object type name of
 * @returns The object type name of the value
 */
export function getObjectType(value: unknown): ObjectTypeName | undefined {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1)

  if (/HTML\w+Element/.test(objectTypeName) && isHtmlElement(value)) {
    return 'HTMLElement'
  }

  if (isObjectTypeName(objectTypeName)) {
    return objectTypeName
  }

  return undefined
}
