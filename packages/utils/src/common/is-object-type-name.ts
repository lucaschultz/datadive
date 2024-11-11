import { typedArrayTypeNames } from './is-typed-array-name'

const objectTypeNames = [
  'Function',
  'Generator',
  'AsyncGenerator',
  'GeneratorFunction',
  'AsyncGeneratorFunction',
  'AsyncFunction',
  'Observable',
  'Array',
  'Buffer',
  'Blob',
  'Object',
  'RegExp',
  'Date',
  'Error',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'WeakRef',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Promise',
  'URL',
  'FormData',
  'URLSearchParams',
  'HTMLElement',
  'NaN',
  ...typedArrayTypeNames,
] as const

export type ObjectTypeName = (typeof objectTypeNames)[number]

/**
 * Check if the given name is an object type name
 * @param name - The name to check
 * @returns `true` if the name is an object type name, `false` otherwise
 */
export function isObjectTypeName(name: unknown): name is ObjectTypeName {
  return objectTypeNames.includes(name as ObjectTypeName)
}
