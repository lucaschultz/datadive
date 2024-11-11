import type {
  Insertable,
  LandlordDatabaseSchema,
  LandlordTable,
} from '@datadive/db'

export type InsertableTenant = Insertable<
  LandlordDatabaseSchema,
  typeof LandlordTable.Tenant
>
