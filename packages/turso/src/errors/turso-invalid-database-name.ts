import { TursoError } from './turso-error'

export class TursoDatabaseNameError extends TursoError {
  public readonly code = TursoError.Codes.InvalidDatabaseName

  constructor(databaseName: string) {
    super(
      `Invalid database name: ${databaseName}. Must be a string of 3-50 lowercase characters containing only letters, numbers, and underscores`,
    )
  }
}
