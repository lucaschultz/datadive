/**
 * Error thrown when a switch statement or if/else statement is not exhaustive.
 */
export class NotExhaustiveError extends Error {
  constructor(value: unknown, allowedValues?: Array<string>) {
    const message = allowedValues
      ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Value '${value}' is not allowed. Allowed values are: ${allowedValues.join(
          ', ',
        )}`
      : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Value '${value}' is not allowed.`

    super(message)
    this.name = 'NotExhaustiveError'
  }
}

/**
 * Use this function to ensure that a switch statement or if/else statement is exhaustive.
 * @param value - The value to check for exhaustiveness
 * @param options - The options for the function
 * @param options.error - The error to throw if the value is not exhaustive
 * @param options.allowedValues - The allowed values for the value
 * @example
 * import exhaustive from 'utilities/exhaustive';
 *
 * type Foo = 'a' | 'b' | 'c';
 *
 * const foo = (f: Foo) => {
 *   switch (f) {
 *     case 'a':
 *       return 'a';
 *     case 'b':
 *       return 'b';
 *     default:
 *       // Type Error: Argument of type 'string' is not assignable to parameter of type 'never'.
 *       // Throws Error: Exhaustive statement expected.
 *       return exhaustive(f);
 *   }
 * };
 */
export const exhaustive = <G extends never>(
  value: G,
  options?: Partial<{
    error: Error
    allowedValues: Array<string>
  }>,
): never => {
  if (options?.error === undefined) {
    throw new NotExhaustiveError(value, options?.allowedValues)
  } else {
    throw options.error
  }
}
