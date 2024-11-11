/**
 * Get for a tenant database from the domain of the tenant
 * @param domain - The domain of the tenant
 * @returns The name of the tenant database
 */
export function getTenantDatabaseName(domain: string) {
  return `datadive-tenant-${domain}-database`
}
