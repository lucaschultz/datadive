import type { createTursoApiClient } from '../client/create-turso-api-client'

import { createInjectionUtilities } from '@datadive/utils/common'

export interface TursoInjection {
  turso: ReturnType<typeof createTursoApiClient>
  organizationName: string
  group: string
}

export const [defineTurso, injectTurso] =
  createInjectionUtilities<TursoInjection>()
