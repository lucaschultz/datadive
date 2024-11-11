import type { TursoInjection } from './utilities/injection'

import { createTursoApiClient } from './client/create-turso-api-client'
import { createAuthToken } from './create-auth-token'
import { createDatabase } from './create-database'
import { deleteDatabase } from './delete-database'
import { listDatabases } from './list-databases'
import { injectTurso } from './utilities/injection'

export const createTurso = (config: {
  authToken: string
  organizationName: string
  group?: string | undefined
}) => {
  const apiClient = createTursoApiClient({ authToken: config.authToken })

  const injection = {
    group: config.group ?? 'default',
    organizationName: config.organizationName,
    turso: apiClient,
  } satisfies TursoInjection

  return {
    createDatabase: injectTurso(injection, createDatabase),
    deleteDatabase: injectTurso(injection, deleteDatabase),
    createAuthToken: injectTurso(injection, createAuthToken),
    listDatabases: injectTurso(injection, listDatabases),
  }
}
