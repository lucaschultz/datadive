/**
 * Nullable type
 * @example
 * type NullableString = Nullable<string> // string | null
 * type NullablePerson = Nullable<{ id: number, name: string }> // { id: number, name: string } | null
 * type Test = Nullable // null
 */
export type Nullable<T = never> = T | null
