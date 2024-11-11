import { sha384 } from 'oslo/crypto'
import { encodeHex } from 'oslo/encoding'

/**
 * Hash a password reset token using sha384
 *
 * **Note:** This function must not be used to hash passwords! If you need to hash
 * a password, use `hashPassword` instead.
 * @param token - The token to hash
 * @returns The hashed token
 */
export async function hashToken(token: string): Promise<string> {
  return encodeHex(await sha384(new TextEncoder().encode(token))).toLowerCase()
}
