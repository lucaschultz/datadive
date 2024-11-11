/**
 * Get the value type of an array or object
 * @template TValue - The array or object
 * @example
 * const array = [1, 2, 3] as const
 * const object = { a: 1, b: 2, c: 3 } as const
 * ValueOf<typeof array> // 1 | 2 | 3
 * ValueOf<typeof object> // 1 | 2 | 3
 */
export type ValueOf<TValue> =
  TValue extends Array<unknown>
    ? TValue[number]
    : TValue extends ReadonlyArray<unknown>
      ? TValue[number]
      : TValue extends { [key: PropertyKey]: unknown }
        ? TValue[keyof TValue]
        : never
