import { ApiErrorCode, ApiErrorName } from '@datadive/spec'

import { apiEnv } from '../../api-env'

export function getErrorType(code: ApiErrorCode) {
  const key = Object.entries(ApiErrorCode).find(
    ([, value]) => value === code,
  )?.[0] as keyof typeof ApiErrorCode | undefined

  if (!key) {
    throw new Error(`Unknown error code: ${code}`)
  }

  const errorName = new Map(Object.entries(ApiErrorName)).get(key)

  if (!errorName) {
    throw new Error(`Unknown error name key: ${key}`)
  }

  return `${apiEnv.BASE_URL}${apiEnv.SPECIFICATION_PATH}#model/${errorName.toLowerCase()}`
}
