import { z } from 'zod'

import { TursoError } from './turso-error'

const TursoErrorResponseData = z.object({
  error: z.string(),
})

export class TursoHttpError extends TursoError {
  public readonly code = TursoError.Codes.Http

  public response: Response
  public request: Request

  constructor(data: unknown, response: Response, request: Request) {
    const code = response.status || response.status === 0 ? response.status : ''
    const title = response.statusText || ''
    const status = `${code.toString()} ${title}`.trim()
    const reason = status ? `status code ${status}` : 'an unknown error'

    const errorData = TursoErrorResponseData.safeParse(data)

    super(
      errorData.success
        ? errorData.data.error
        : `Request failed with ${reason}: ${request.method} ${request.url}`,
    )

    this.name = 'HTTPError'
    this.response = response
    this.request = request
  }
}
