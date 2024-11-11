import { constEnum } from '@datadive/utils/common'

/**
 * Datadive has two types of databases: tenant and landlord
 */
export const DatabaseType = constEnum({
  Tenant: 'tenant',
  Landlord: 'landlord',
})

export type DatabaseType = constEnum<typeof DatabaseType>

/**
 * Check if the given value is a {@link DatabaseType}
 * @param value - The value to check
 * @returns `true` if the value is a {@link DatabaseType}, `false` otherwise
 */
export function isDatabaseType(value: unknown): value is DatabaseType {
  const values: Array<unknown> = Object.values(DatabaseType)

  return values.includes(value)
}
