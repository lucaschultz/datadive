import type { Prettify } from '@datadive/utils/type'
import type { Selectable as KyselySelectable } from 'kysely'
import type { LandlordDatabaseSchema } from '../../landlord/create-landlord-kysely'
import type { TenantDatabaseSchema } from '../../tenant/create-tenant-kysely'

export type Selectable<
  TSchema extends LandlordDatabaseSchema | TenantDatabaseSchema,
  TTableName extends keyof TSchema,
> = Prettify<KyselySelectable<TSchema[TTableName]>>
