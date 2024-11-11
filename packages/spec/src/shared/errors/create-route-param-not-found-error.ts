import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { z } from '../utilities/z'

export function createRouteParamNotFoundError<
  TErrorMessagesSchema extends z.ZodTypeAny,
>(errorMessagesSchema: TErrorMessagesSchema) {
  return z
    .object({
      success: z.literal(false),
      title: z.string(),
      detail: z.string().optional(),
      status: z.number().int(),
      type: z.string(),
      code: z.literal(ApiErrorCode.RouteParamNotFound),
      errorMessages: z.object({
        routeParameters: errorMessagesSchema,
      }),
    })
    .openapi(ApiErrorName.RouteParamNotFound, {
      description: 'One or more route parameters do not match any records.',
    })
}

export type RouteParamNotFoundError<
  TErrorMessages extends { [key: string]: Array<string> } = {
    [key: string]: Array<string>
  },
> = z.infer<
  ReturnType<typeof createRouteParamNotFoundError<z.ZodType<TErrorMessages>>>
>
