import type { ArgDef } from 'citty'

import { DatabaseType, isDatabaseType } from '../../constants/database-type'
import { exitWithError } from './exit-with-error'

/**
 * Assert that the value is allowed as "for" argument
 * @param value - The value to check
 */
export function assertAllowedForArg(
  value: string,
): asserts value is DatabaseType {
  if (!isDatabaseType(value)) {
    exitWithError(
      `Invalid database "${value}". Must be one of "${Object.values(DatabaseType).join('", "')}".`,
    )
  }
}

/**
 * Get the "for" argument
 * @param description - The description of the argument
 * @returns The argument definition
 */
export function getForArg(description: string) {
  return {
    type: 'positional',
    description: description,
    valueHint: Object.values(DatabaseType)
      .map((s) => `"${s}"`)
      .join('|'),
    required: true,
  } satisfies ArgDef
}
