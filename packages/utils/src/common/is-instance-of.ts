// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClass = new (...args: Array<any>) => any

/**
 * Typeguard to check if a value is an instance of any of the provided classes.
 * @param value - The value to check.
 * @param classes - The classes to check against.
 * @returns `true` if the value is an instance of any of the provided classes, `false` otherwise.
 * @example
 * ```ts
 * class MyClass1 {
 *   public readonly prop = 'prop1'
 * }
 * class MyClass2 {
 *   public readonly prop = 'prop2'
 * }
 *
 * const test: unknown = new MyClass1()
 *
 * if (isInstanceOf(test, [MyClass1, MyClass2])) {
 *   test // Type is MyClass1 | MyClass2
 * }
 * ```
 */
export function isInstanceOf<T extends ReadonlyArray<AnyClass>>(
  value: unknown,
  classes: T,
): value is InstanceType<T[number]> {
  return classes.some((type) => value instanceof type)
}
