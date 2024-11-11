import type {
  LandlordDatabaseSchema,
  LandlordTable,
  Selectable,
} from '@datadive/db'

export type SelectableTenantDatabase = Selectable<
  LandlordDatabaseSchema,
  typeof LandlordTable.TenantDatabase
>
