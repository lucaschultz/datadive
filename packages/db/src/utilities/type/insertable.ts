import type { Prettify } from '@datadive/utils/type'
import type { Insertable as KyselyInsertable } from 'kysely'
import type { LandlordDatabaseSchema } from '../../landlord/create-landlord-kysely'
import type { TenantDatabaseSchema } from '../../tenant/create-tenant-kysely'
import type { WithoutGenerated } from './without-generated'

export type Insertable<
  TSchema extends LandlordDatabaseSchema | TenantDatabaseSchema,
  TTableName extends keyof TSchema,
> = Prettify<WithoutGenerated<KyselyInsertable<TSchema[TTableName]>>>
