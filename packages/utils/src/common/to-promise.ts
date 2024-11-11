/**
 * Converts a function or a function returning a promise into a promise.
 * @param fn - The function to be converted into a promise.
 * @returns A promise that resolves to the result of the function.
 * @template T - The type of the result returned by the function.
 */
export function toPromise<T>(fn: (() => T) | (() => Promise<T>)) {
  return Promise.resolve(fn())
}
