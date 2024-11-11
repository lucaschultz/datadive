import { z } from '../utilities/z'

export const Id = z
  .string()
  .length(26)
  // eslint-disable-next-line regexp/prefer-range
  .regex(/^[0123456789abcdefghjkmnpqrstvwxyz]{26}$/, {
    message: 'Must be lowercase base32',
  })
  .openapi({
    description: 'A string of 26 random lowercase base32 characters',
    example: '01j50t2ampffbr375swavgqy5x',
  })
