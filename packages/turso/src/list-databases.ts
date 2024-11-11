import { defineTurso } from './utilities/injection'

export const listDatabases = defineTurso(
  (
    injection,
    params?: {
      organizationName?: string | undefined
      group?: string | undefined
    },
  ) => {
    const { turso, organizationName, group } = injection

    return turso
      .get('/v1/organizations/{organizationName}/databases', {
        path: {
          organizationName: params?.organizationName ?? organizationName,
        },
        query: { group: params?.group ?? group },
      })
      .map((result) => result.databases)
  },
)
