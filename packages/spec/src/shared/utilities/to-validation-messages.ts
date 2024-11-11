import { z } from './z'

export type ValidationMessages<TSchema extends z.AnyZodObject> = z.ZodObject<{
  [TKey in keyof z.input<TSchema>]: z.ZodOptional<z.ZodArray<z.ZodString>>
}>

export function toValidationMessages<
  TSchema extends z.ZodObject<z.ZodRawShape>,
>(schema: TSchema) {
  const shape = new Map<string, z.ZodOptional<z.ZodArray<z.ZodString>>>()

  for (const key of Object.keys(schema.shape)) {
    shape.set(key, z.array(z.string()).optional())
  }

  return z.object(Object.fromEntries(shape)) as ValidationMessages<TSchema>
}
