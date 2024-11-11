import type { CamelCase } from 'type-fest'
import type { ApiErrorCode } from '../constants/api-error-code'

import { constEnum, toCamelCase } from '@datadive/utils/common'

import { z } from '../utilities/z'

export const ValidationTarget = constEnum({
  RouteParam: 'route_param',
  Body: 'body',
  QueryParam: 'query_param',
  Header: 'header',
  Cookie: 'cookie',
})

export type ValidationTarget = constEnum<typeof ValidationTarget>

export function createValidationError<
  TTarget extends ValidationTarget,
  TErrorMessagesSchema extends z.ZodTypeAny,
>(target: TTarget, errorMessagesSchema: TErrorMessagesSchema) {
  return z.object({
    success: z.literal(false),
    title: z.literal('Validation failed'),
    detail: z.string().optional(),
    status: z.number().int(),
    type: z.string(),
    code: z.literal(
      `${target}_validation`,
    ) satisfies z.ZodLiteral<ApiErrorCode>,
    errorMessages: z.object({
      [toCamelCase(target)]: errorMessagesSchema,
    } as { [key in CamelCase<TTarget>]: TErrorMessagesSchema }),
  })
}

export type ValidationError<
  TTarget extends ValidationTarget = ValidationTarget,
  TErrorMessages extends { [key: string]: Array<string> } = {
    [key: string]: Array<string>
  },
> = TTarget extends ValidationTarget
  ? ReturnType<typeof createValidationError<TTarget, z.ZodType<TErrorMessages>>>
  : never
