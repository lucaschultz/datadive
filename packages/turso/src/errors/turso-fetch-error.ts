import { TursoError } from './turso-error'

export class TursoFetchError extends TursoError {
  public readonly code = TursoError.Codes.Fetch
  public override readonly cause: unknown
  public readonly request: Request

  constructor(cause: unknown, request: Request) {
    super('Fetching from the Turso API failed', { cause })

    this.request = request
    this.cause = cause
  }
}
