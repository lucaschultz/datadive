import type { Result } from 'neverthrow'
import type { Fetcher } from './safe-api-client'

import { err, ok, ResultAsync } from 'neverthrow'

import { TursoFetchError } from '../errors/turso-fetch-error'
import { TursoHttpError } from '../errors/turso-http-error'
import { TursoValidationError } from '../errors/turso-validation-error'
import { getResponseSchema } from './get-response-schema'
import { createSafeApiClient } from './safe-api-client'

export const BASE_URL = 'https://api.turso.tech'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapResultPromise = <A extends Array<any>, T, E>(
  func: (...args: A) => Promise<Result<T, E>>,
): ((...args: A) => ResultAsync<T, E>) => {
  return (...args): ResultAsync<T, E> => new ResultAsync(func(...args))
}

/**
 * Create a Turso API client
 * @param credentials Credentials to authenticate with the Turso API
 * @param credentials.authToken Authentication token
 * @returns Turso API client
 */
export function createTursoApiClient(credentials: { authToken: string }) {
  const fetcher: Fetcher = wrapResultPromise(async (method, url, params) => {
    const headers = {
      Authorization: `Bearer ${credentials.authToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const originalUrl = url
    const options: RequestInit = { method, headers }

    // Add body to request
    if (params?.body && (method === 'post' || method === 'put')) {
      options.body = JSON.stringify(params.body)
    }

    // Replace path parameters in url
    if (params?.path) {
      Object.entries(params.path).forEach(([key, value]) => {
        if (typeof value === 'string') {
          url = url.replaceAll(`{${encodeURIComponent(key)}}`, value)
        }
      })
    }

    // Add query parameters to url
    if (params?.query) {
      const queryParams = Object.entries(params.query)
        .map(([key, value]) => {
          // Convert value to string if it is not already a string
          const stringValue = typeof value === 'string' ? value : String(value)
          return `${encodeURIComponent(key)}=${encodeURIComponent(stringValue)}`
        })
        .join('&')
      if (queryParams) {
        url += `?${queryParams}`
      }
    }

    const request = new Request(url, options)

    try {
      const response = await fetch(request)

      if (!response.ok) {
        const responseData = (await response.clone().json()) as unknown

        return err(new TursoHttpError(responseData, response, request))
      }

      const responseSchema = getResponseSchema(method, originalUrl)

      const data = (await response.json()) as unknown

      const parsedData = responseSchema.safeParse(data)

      if (!parsedData.success) {
        return err(new TursoValidationError(parsedData.error))
      }

      return ok(parsedData.data)
    } catch (error) {
      return err(new TursoFetchError(error, request))
    }
  })

  return createSafeApiClient(fetcher, BASE_URL)
}
