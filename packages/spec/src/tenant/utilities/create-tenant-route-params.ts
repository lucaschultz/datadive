import { z } from '../../shared/utilities/z'

export function createTenantRouteParams<
  TParams extends z.ZodRawShape | undefined,
>(params?: TParams) {
  return z.object({
    tenantDomain: z.string(),
    ...params,
  })
}
