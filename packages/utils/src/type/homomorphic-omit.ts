/**
 * A omit utility type which is homomorphic (i.e. which works with discriminated unions)
 * @see https://github.com/microsoft/TypeScript/issues/54451#issue-1732749888
 */
export type HomomorphicOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
