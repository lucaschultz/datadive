import { fromString, typeidUnboxed } from 'typeid-js'

/**
 * Validate that the id is a UUIDv7 encoded in base32 with a length of 26 characters
 * @see {@link https://github.com/jetify-com/typeid/tree/main/spec#typeid-specification-version-030|TypeId (without prefix)}
 * @param id - The id to validate
 * @throws If the id is not valid
 * @returns `true` if the id is valid, throws an error otherwise
 */
export function validateDatadiveId(id: string): true | never {
  fromString(id)

  return true
}

/**
 * Generate a UUIDv7 encoded in base32 with a length of 26 characters
 * @see {@link https://github.com/jetify-com/typeid/tree/main/spec#typeid-specification-version-030|TypeId (without prefix)}
 * @returns The generated id
 */
export function generateDatadiveId() {
  return typeidUnboxed() as string
}
