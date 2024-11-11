import { defineTurso } from './utilities/injection'

export const createAuthToken = defineTurso(
  (
    injection,
    params: {
      organizationName?: string
      databaseName: string
      access?: 'full-access' | 'read-only'
    },
  ) => {
    const { turso, organizationName } = injection

    return turso
      .post(
        '/v1/organizations/{organizationName}/databases/{databaseName}/auth/tokens',
        {
          path: {
            organizationName: params.organizationName ?? organizationName,
            databaseName: params.databaseName,
          },
          body: {
            permissions: {},
          },
          query: {
            authorization: params.access ?? 'full-access',
          },
        },
      )
      .map((result) => result.jwt)
  },
)
