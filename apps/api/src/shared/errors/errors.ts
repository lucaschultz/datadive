import type { ValueOf } from '@datadive/utils/type'

import { DatadiveError } from '@datadive/utils/common'

const ErrorCode = {
  ResponseCreationFailed: 'response_creation_failed',
} as const

type ErrorCode = ValueOf<typeof ErrorCode>

export class ResponseCreationFailed extends DatadiveError<
  typeof ErrorCode.ResponseCreationFailed
> {
  public readonly code = ErrorCode.ResponseCreationFailed
}
