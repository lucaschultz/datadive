/**
 * Nullish type
 * @example
 * type NullishString = Nullish<string> // string | undefined | null
 * type NullishPerson = Nullish<{ id: number, name: string }> // { id: number, name: string } | undefined | null
 * type Test = Nullish // undefined | null
 */
export type Nullish<T = never> = T | undefined | null
