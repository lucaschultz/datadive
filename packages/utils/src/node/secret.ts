import * as crypto from 'node:crypto'

const ALGORITHM = 'aes-256-cbc'

/**
 * Generates a random key
 * @returns The key as a hex string
 */
export function generateKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Extracts the initialization vector and encrypted text from a hex string
 * @param hexString - The hex string
 * @returns The initialization vector and encrypted text
 */
function extractInitializationVector(hexString: string): {
  initializationVector: Buffer
  encryptedText: string
} {
  const initializationVector = Buffer.from(hexString.slice(0, 32), 'hex')
  const encryptedText = hexString.slice(32)
  return { initializationVector, encryptedText }
}

/**
 * Encrypts a text using AES-256-CBC
 * @param text - The text to encrypt
 * @param key - The encryption key
 * @returns A string containing the initialization vector in the first 32 characters
 * and the encrypted text in the remaining characters
 */
export function encryptText(text: string, key: string): string {
  const initializationVector = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    initializationVector,
  )

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${initializationVector.toString('hex')}${encrypted}`
}

/**
 * Decrypts a text using AES-256-CBC
 * @param encryptedText - The text to decrypt
 * @param key - The encryption key
 * @returns The decrypted text
 */
export function decryptText(encryptedText: string, key: string): string {
  const { initializationVector, encryptedText: text } =
    extractInitializationVector(encryptedText)

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    initializationVector,
  )
  let decrypted = decipher.update(text, 'hex', 'utf8')

  decrypted += decipher.final('utf8')
  return decrypted
}
