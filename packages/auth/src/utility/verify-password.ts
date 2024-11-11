import { Argon2id } from 'oslo/password'

/**
 * Verify that a password matches a hash
 *
 * This function uses `argon2id` to verify the hash against the password.
 * @param verify - The password and hashed password to verify
 * @param verify.hash - The hashed password
 * @param verify.password - The password to verify
 * @returns `true` if the password matches the hashed password, `false` otherwise
 */
export async function verifyPassword(verify: {
  hash: string
  password: string
}): Promise<boolean> {
  const argon2id = new Argon2id({
    memorySize: 19456,
    iterations: 2,
    tagLength: 32,
    parallelism: 1,
  })

  return await argon2id.verify(verify.hash, verify.password)
}
