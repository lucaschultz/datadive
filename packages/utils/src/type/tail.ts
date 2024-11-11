/**
 * Get the tail of a tuple
 * @example
 * type Tuple = [1, 2, 3]
 * type Result = Tail<Tuple> // [2, 3]
 */
export type Tail<TTuple extends Array<unknown>> = TTuple extends [
  unknown,
  ...infer U,
]
  ? U
  : never
