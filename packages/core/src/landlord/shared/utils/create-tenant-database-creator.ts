import type { ResultAsync } from 'neverthrow'

import { createDatabase, DbError, getTenantDatabaseName } from '@datadive/db'

import { CoreError } from '../../../errors/core-error'

type TenantDatabaseCreator = (
  tenantName: string,
) => ResultAsync<
  { url: string; authToken?: string | undefined },
  DbError.DatabaseExists | CoreError.CreateDatabase
>

export function createTenantDatabaseCreator(credentials: {
  organization: string
  authToken: string
}): TenantDatabaseCreator {
  const tenantDatabaseCreator: TenantDatabaseCreator = (tenantName: string) => {
    return createDatabase(getTenantDatabaseName(tenantName), {
      organization: credentials.organization,
      authToken: credentials.authToken,
    }).mapErr((err) => {
      if (err instanceof DbError.DatabaseExists) {
        return err
      } else {
        return new CoreError.CreateDatabase(err)
      }
    })
  }

  return tenantDatabaseCreator
}
