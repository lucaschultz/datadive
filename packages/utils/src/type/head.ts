/**
 * Get the head of a tuple
 * @example
 * type Tuple = [1, 2, 3]
 * type Result = Head<Tuple> // 1
 */
export type Head<TTuple extends Array<unknown>> = TTuple extends [
  infer THead,
  ...Array<unknown>,
]
  ? THead
  : never
