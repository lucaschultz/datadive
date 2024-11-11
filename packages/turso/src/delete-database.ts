import { defineTurso } from './utilities/injection'

export const deleteDatabase = defineTurso(
  (
    injection,
    params: {
      databaseName: string
      organizationName?: string | undefined
      group?: string | undefined
    },
  ) => {
    const { turso, organizationName } = injection

    return turso
      .delete('/v1/organizations/{organizationName}/databases/{databaseName}', {
        path: {
          databaseName: params.databaseName,
          organizationName: params.organizationName ?? organizationName,
        },
      })
      .map((result) => result.database)
  },
)
