import { z } from '../utilities/z'

export const Timestamp = z.string().datetime().openapi({
  example: '2021-01-01T00:00:00Z',
})

export const Timestamps = {
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

export const Deletable = {
  deletedAt: Timestamp.nullable(),
}
