import type { ValueOf } from '../type'

interface Enumable {
  [key: string]: string
}

/**
 * __Create a constant object that can be used like an enum__
 *
 * {@link https://basarat.gitbook.io/typescript/type-system/enums|Native Typescript Enums}
 * are considered harmful, watch {@link https://www.youtube.com/watch?v=jjMbPt_H3RQ|this video}
 * for more information. Instead, use this function to create a constant object
 * that can be used like an enum.
 * @param obj - The object to create the constant enum from
 * @returns The constant enum
 * @example
 * ```
 * export const UserStatus = constEnum({
 *  Online: 'online',
 *  Offline: 'offline',
 * })
 *
 * export type UserStatus = constEnum<typeof UserStatus>
 * ```
 *
 * You can then use the constant enum like this:
 *
 * ```
 * function logUserStatus(status: UserStatus) {
 *   console.log(`User is ${status}`)
 * }
 *
 * logUserStatus(UserStatus.Online) // ✔︎ works
 * logUserStatus('online') // ✔︎ works
 * logUserStatus('Online') // ✖️ does not work
 * ```
 */
export function constEnum<const T extends { [key: string]: string }>(obj: T) {
  return obj
}

export type constEnum<T extends Enumable> = ValueOf<T>
