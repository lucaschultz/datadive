import type { DbError } from '@datadive/db'
import type { TursoError } from '@datadive/turso'

import { constEnum, ErrorWithCode } from '@datadive/utils/common'

export const Code = constEnum({
  SessionIdNotFound: 'session_id_not_found',
  InvalidSessionId: 'invalid_session_id',
  CouldNotGetCount: 'could_not_get_count',
  InvalidPerPage: 'invalid_per_page',
  InvalidPage: 'invalid_page',
  DuplicateEmail: 'duplicate_email',
  DuplicateUsername: 'duplicate_username',
  InvalidTenantDomain: 'invalid_tenant_domain',
  DuplicateDomain: 'duplicate_domain',
  CreateDatabase: 'creating_database_failed',
} satisfies { [key: string]: Lowercase<string> })

export type Code = constEnum<typeof Code>

export class CreateDatabase extends ErrorWithCode<Code> {
  public readonly code = Code.CreateDatabase

  constructor(
    public override cause: TursoError | DbError.DatabaseAdoptionFailed,
  ) {
    super('Creating database failed', { cause })
  }
}

export class DuplicateDomain extends ErrorWithCode<Code> {
  public readonly code = Code.DuplicateDomain

  public constructor(
    public readonly domain: string,
    message?: string,
    options?: { cause?: unknown },
  ) {
    super(message ?? `Domain ${domain} already exists`, options)
  }
}

export class InvalidTenantDomain extends ErrorWithCode<Code> {
  public readonly code = Code.InvalidTenantDomain

  constructor(domain: string) {
    super(
      `Invalid tenant domain: ${domain}. Must be a string of 3-50 lowercase characters containing only letters, numbers, and underscores`,
    )
  }
}

export class CouldNotGetCount extends ErrorWithCode<Code> {
  public readonly code = Code.CouldNotGetCount
}

export class DuplicateEmail extends ErrorWithCode<Code> {
  public readonly code = Code.DuplicateEmail

  public constructor(
    public readonly email: string,
    message?: string,
    options?: { cause?: unknown },
  ) {
    super(message ?? `Email ${email} already exists`, options)
  }
}

export class DuplicateUsername extends ErrorWithCode<Code> {
  public readonly code = Code.DuplicateUsername

  public constructor(
    public readonly username: string,
    message?: string,
    options?: { cause?: unknown },
  ) {
    super(message ?? `Username ${username} already exists`, options)
  }
}

export class InvalidPage extends ErrorWithCode<Code> {
  public readonly code = Code.InvalidPage
}

export class InvalidPerPage extends ErrorWithCode<Code> {
  public readonly code = Code.InvalidPerPage
}

export class InvalidSessionId extends ErrorWithCode<Code> {
  public readonly code = Code.InvalidSessionId

  constructor(
    public readonly foundIn: 'cookie' | 'bearer_token',
    message?: string,
    options?: { cause: unknown },
  ) {
    super(message, options)
  }
}

export class SessionIdNotFound extends ErrorWithCode<Code> {
  public readonly code = Code.SessionIdNotFound
}
