import { z } from '../../shared/utilities/z'

export const DefaultTenantRouteParams = z.object({
  tenantDomain: z.string(),
})

export function createTenantRouteParams<TParams extends z.ZodRawShape>(
  params: TParams,
) {
  return DefaultTenantRouteParams.extend(params)
}
