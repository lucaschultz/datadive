export const typedArrayTypeNames = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
] as const

type TypedArrayTypeName = (typeof typedArrayTypeNames)[number]

/**
 * Check if the given name is a typed array name
 * @param name - The name to check
 * @returns `true` if the name is a typed array name, `false` otherwise
 */
export function isTypedArrayName(name: unknown): name is TypedArrayTypeName {
  return typedArrayTypeNames.includes(name as TypedArrayTypeName)
}
