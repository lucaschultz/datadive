import type { MigrationResult } from '../migrate'

import { constEnum, ErrorWithCode } from '@datadive/utils/common'

export const ErrorCode = constEnum({
  DatabaseExists: 'database_exists',
  DatabaseAdopt: 'database_adopt',
  InvalidCount: 'invalid_count',
  InvalidPage: 'invalid_page',
  InvalidPageSize: 'invalid_page_size',
  NoQueryResult: 'no_query_result',
  MigrationFailed: 'migration_failed',
  QueryFailed: 'query_failed',
  ClientInitialization: 'client_initialization',
  KyselyInitialization: 'kysely_initialization',
} satisfies { [key: string]: Lowercase<string> })

export type ErrorCode = constEnum<typeof ErrorCode>

export class ClientInitializationFailed extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.ClientInitialization

  public constructor(
    public override readonly cause: unknown,
    message?: string | undefined,
  ) {
    super(message, { cause })
  }
}

export class DatabaseExists extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.DatabaseExists
}

export class DatabaseAdoptionFailed extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.DatabaseAdopt

  public constructor(
    public readonly databaseUrl: string,
    message?: string | undefined,
  ) {
    super(message)
  }
}

export class InvalidCount extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.InvalidCount
}

export class InvalidPage extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.InvalidPage
}

export class InvalidPageSize extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.InvalidPageSize
}

export class KyselyInitializationFailed extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.KyselyInitialization

  public constructor(
    public override readonly cause: unknown,
    public readonly type: 'landlord' | 'tenant',
  ) {
    super(`Can't initialize ${type} kysely instance`, { cause })
  }
}

export class MigrationFailed extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.MigrationFailed

  constructor(
    public override readonly cause: unknown,
    public readonly migrationResults: ReadonlyArray<MigrationResult>,
    message?: string | undefined,
  ) {
    super(message, { cause })
  }
}

export class NoQueryResult extends ErrorWithCode<ErrorCode> {
  public readonly code = ErrorCode.NoQueryResult

  public constructor(
    public readonly query: { sql: string; parameters: ReadonlyArray<unknown> },
    message?: string,
    options?: { cause: unknown },
  ) {
    super(message, options)
  }
}

export class QueryFailed extends ErrorWithCode<typeof ErrorCode.QueryFailed> {
  public readonly code = ErrorCode.QueryFailed

  public constructor(
    public readonly query: { sql: string; parameters: ReadonlyArray<unknown> },
    public override readonly cause: unknown,
    message?: string,
  ) {
    super(message, { cause })
  }
}
