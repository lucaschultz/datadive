import type {
  Insertable,
  LandlordDatabaseSchema,
  LandlordTable,
} from '@datadive/db'

export type InsertableTenantDatabase = Insertable<
  LandlordDatabaseSchema,
  typeof LandlordTable.TenantDatabase
>
