import camelCase from 'lodash/camelCase'
import type { CamelCase } from 'type-fest'

/**
 * Converts a string to camel case.
 *
 * @param value - The string to convert.
 * @returns The camel case string.
 */
export const toCamelCase = <T extends string = string>(value: T): CamelCase<T> => {
  if (typeof value !== 'string') {
    return value as CamelCase<T>
  }

  return camelCase(value) as CamelCase<T>
}
