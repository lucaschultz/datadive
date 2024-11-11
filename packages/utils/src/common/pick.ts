/**
 * Takes an object and some of it's keys and returns a new object with *only* the specified keys
 * @param obj The object to pick keys from.
 * @param keys The keys to pick from the object.
 * @returns A new object with the specified keys.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * pick(obj, ['a', 'b']); // { a: 1, b: 2 }
 * pick(obj, ['a', 'c']); // { a: 1, c: 3 }
 */
export function pick<
  T extends { [key: PropertyKey]: unknown },
  K extends keyof T,
>(obj: T, keys: Array<K>) {
  const resultMap = new Map()
  const objMap = new Map(Object.entries(obj))

  keys.forEach((key) => {
    resultMap.set(key.toString(), objMap.get(key.toString()))
  })

  return Object.fromEntries(resultMap) as Pick<T, K>
}
