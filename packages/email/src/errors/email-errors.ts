import type { ValueOf } from '@datadive/utils/type'

import { DatadiveError } from '@datadive/utils/common'

export const Code = {
  SendingEmailFailed: 'sending_email_failed',
} as const

export type Code = ValueOf<typeof Code>

export class SendingEmailFailed extends DatadiveError<
  typeof Code.SendingEmailFailed
> {
  public readonly code = Code.SendingEmailFailed
}
