import type { z } from 'zod'

import { TursoError } from './turso-error'

export class TursoValidationError<
  TSchema extends z.ZodTypeAny,
> extends TursoError {
  public readonly code = TursoError.Codes.Validation
  public override readonly cause: z.ZodError<z.input<TSchema>>

  constructor(cause: z.ZodError<z.input<TSchema>>) {
    super('Validating turso response failed', { cause })

    this.cause = cause
  }
}
