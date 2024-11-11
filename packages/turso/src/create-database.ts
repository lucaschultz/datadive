import { err, ok, ResultAsync } from 'neverthrow'

import { toPromise } from '@datadive/utils/common'

import { TursoDatabaseNameError } from './errors/turso-invalid-database-name'
import { defineTurso } from './utilities/injection'

const databaseNameRegex = /^[a-z0-9-]{3,50}$/

export const createDatabase = defineTurso(
  (
    injection,
    params: {
      databaseName: string
      organizationName?: string | undefined
      group?: string | undefined
    },
  ) => {
    const { turso, organizationName, group } = injection

    return new ResultAsync(
      toPromise(() => {
        if (!databaseNameRegex.test(params.databaseName)) {
          return err(new TursoDatabaseNameError(params.databaseName))
        }

        return ok(params.databaseName)
      }),
    )
      .andThen((validatedDatabaseName) => {
        return turso.post('/v1/organizations/{organizationName}/databases', {
          path: {
            organizationName: params.organizationName ?? organizationName,
          },
          body: {
            name: validatedDatabaseName,
            group: params.group ?? group,
          },
        })
      })
      .map((createResult) => {
        return createResult.database
      })
  },
)
