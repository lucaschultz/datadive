export { getTenantDatabaseName } from './tenant/utility/get-tenant-database-name'

// Utilities
export { createDatabaseClient } from './create-database-client'

export { createDatabase } from './create-database'

export * from './migrate'

export { execute } from './utilities/execute'
export {
  executePaginated,
  type Paginated,
  type PaginationOptions,
} from './utilities/execute-paginated'
export { executeTakeFirst } from './utilities/execute-take-first'
export type { Insertable } from './utilities/type/insertable'
export type { Selectable } from './utilities/type/selectable'
export type { Updateable } from './utilities/type/updateable'

// Landlord
export { LandlordTable } from './landlord/constants/landlord-table'
export {
  createLandlordKysely,
  type LandlordDatabaseSchema,
  type LandlordKysely,
} from './landlord/create-landlord-kysely'

// Tenant
export { TenantTable } from './tenant/constants/tenant-table'
export {
  createTenantKysely,
  type TenantDatabaseSchema,
  type TenantKysely,
} from './tenant/create-tenant-kysely'

// Errors
export { DbError } from './errors/db-error'
