import {v4 as uuid } from 'uuid'
import { createHmac } from 'crypto'

/**
 * Convert a string to a hash string.
 *
 * @param data data that need to be hashed.
 * @param algorithm hash algorithm
 * @returns string
 */
export function hashEncode (data: string, algorithm: string = 'sha256'): string {
  return createHmac(algorithm, data).digest('hex')
}

/**
 * Generate a unique has from uuid helper.
 *
 * @returns string
 */
export function uniqueHash () {
  return hashEncode(uuid())
}
