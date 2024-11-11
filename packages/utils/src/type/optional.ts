/**
 * Optional type
 * @example
 * type OptionalString = Optional<string> // string | undefined
 * type OptionalPerson = Optional<{ id: number, name: string }> // { id: number, name: string } | undefined
 * type Test = Optional // undefined
 */
export type Optional<T = never> = T | undefined
