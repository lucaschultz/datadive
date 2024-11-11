/**
 * Check if two types are equal
 * @example
 * ```ts
 * type A = Equals<{ a: number }, { a: number }> // true
 * type B = Equals<{ a: number }, { a: string }> // false
 * ```
 */
export type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false
