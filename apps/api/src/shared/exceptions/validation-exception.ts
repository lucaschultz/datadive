import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { ApiError, EndpointResponseSchema } from '@datadive/spec'
import type { HomomorphicOmit, Prettify } from '@datadive/utils/type'
import type { ValidationTargets } from 'hono'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { ApiErrorCode } from '@datadive/spec'
import { exhaustive } from '@datadive/utils/common'

import { getErrorType } from '../utils/get-error-type'
import { toValidationErrors } from '../utils/to-validation-errors'

type ValidationErrorBody =
  | z.output<typeof ApiError.BodyValidation>
  | z.output<typeof ApiError.CookieValidation>
  | z.output<typeof ApiError.HeaderValidation>
  | z.output<typeof ApiError.QueryParamValidation>
  | z.output<typeof ApiError.RouteParamValidation>

type ValidationExceptionData = Prettify<
  HomomorphicOmit<ValidationErrorBody, 'success' | 'status' | 'title'>
>

function getValidationErrorBody(
  target: keyof ValidationTargets,
  error: z.ZodError,
): ValidationExceptionData {
  switch (target) {
    case 'query':
      return {
        code: ApiErrorCode.QueryParamValidation,
        type: getErrorType(ApiErrorCode.QueryParamValidation),
        errorMessages: {
          queryParam: toValidationErrors(error),
        },
      }
    case 'param':
      return {
        code: ApiErrorCode.RouteParamValidation,
        type: getErrorType(ApiErrorCode.RouteParamValidation),
        errorMessages: {
          routeParam: toValidationErrors(error),
        },
      }
    case 'header':
      return {
        code: ApiErrorCode.HeaderValidation,
        type: getErrorType(ApiErrorCode.HeaderValidation),
        errorMessages: { header: toValidationErrors(error) },
      }
    case 'cookie':
      return {
        code: ApiErrorCode.CookieValidation,
        type: getErrorType(ApiErrorCode.CookieValidation),
        errorMessages: { cookie: toValidationErrors(error) },
      }
    case 'form':
      return {
        code: ApiErrorCode.BodyValidation,
        type: getErrorType(ApiErrorCode.BodyValidation),
        errorMessages: { body: toValidationErrors(error) },
      }
    case 'json':
      return {
        code: ApiErrorCode.BodyValidation,
        type: getErrorType(ApiErrorCode.BodyValidation),
        errorMessages: { body: toValidationErrors(error) },
      }
    default:
      return exhaustive(target)
  }
}

interface ValidationExceptionOptions {
  message?: string
  cause?: unknown
}

export class ValidationException extends HTTPException {
  constructor(
    body: ValidationExceptionData,
    options?: ValidationExceptionOptions,
  ) {
    super(422, {
      ...options,
      res: Response.json({
        success: false,
        status: 422,
        title: 'Validation failed',
        ...body,
      } satisfies ValidationErrorBody),
    })
  }

  static fromZodError(
    target: keyof ValidationTargets,
    error: z.ZodError,
    options?: ValidationExceptionOptions,
  ) {
    return new ValidationException(
      getValidationErrorBody(target, error),
      options,
    )
  }

  public static forRoute<TRouteConfig extends RouteConfig>(
    _route: TRouteConfig,
    data: Pick<
      z.output<EndpointResponseSchema<TRouteConfig, 422>>,
      'errorMessages' | 'detail' | 'code' | 'type'
    >,
  ) {
    return new ValidationException(data)
  }
}
