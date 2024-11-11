import { constEnum, ErrorWithCode } from '@datadive/utils/common'

const TursoErrorCode = constEnum({
  Http: 'turso_response_not_ok',
  Validation: 'turso_validation_failed',
  Fetch: 'turso_fetch_error',
  InvalidDatabaseName: 'turso_invalid_database_name',
})

type TursoErrorCode = constEnum<typeof TursoErrorCode>

export abstract class TursoError extends ErrorWithCode<TursoErrorCode> {
  public static readonly Codes = TursoErrorCode
}
