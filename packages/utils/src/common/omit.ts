import type { HomomorphicOmit } from '../type/homomorphic-omit'
import type { Prettify } from '../type/prettify'

/**
 * Takes an object and some of it's keys and returns a new object *without* the specified keys
 * @param obj The object to omit keys from.
 * @param keys The keys to omit from the object.
 * @returns A new object without the specified keys.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ['a', 'b']); // { c: 3 }
 * omit(obj, ['a', 'c']); // { b: 2 }
 */
export function omit<
  T extends { [key: PropertyKey]: unknown },
  K extends keyof T,
>(obj: T, keys: Array<K>) {
  const map = new Map(Object.entries(obj))

  keys.forEach((key) => {
    map.delete(key.toString())
  })

  return Object.fromEntries(map) as Prettify<HomomorphicOmit<T, K>>
}
