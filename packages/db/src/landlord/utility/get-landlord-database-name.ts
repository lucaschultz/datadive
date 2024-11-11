/**
 * Get the name of a landlord database from the name of the landlord
 * @param landlordName - The name of the landlord
 * @returns The name of the landlord database
 */
export function getLandlordDatabaseName(landlordName: string) {
  return `datadive-landlord-${landlordName}-database`
}
