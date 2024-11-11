import { Argon2id } from 'oslo/password'

/**
 * Hash a password
 *
 * This function uses {@link https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id} to hash the password. Either `Bun.password.hash`
 * or `@node-rs/argon2.hash` is used depending on the environment.
 * @param password - The password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const argon2id = new Argon2id({
    memorySize: 19456,
    iterations: 2,
    tagLength: 32,
    parallelism: 1,
  })

  return await argon2id.hash(password)
}
