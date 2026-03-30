import snakeCase from 'lodash/snakeCase'
import type { SnakeCase } from 'type-fest'

/**
 * Converts a string to snake case.
 *
 * @param value - The string to convert.
 * @returns The snake case string.
 */
export const toSnakeCase = <T extends string = string>(value: T): SnakeCase<T> => {
  if (typeof value !== 'string') {
    return value as SnakeCase<T>
  }

  return snakeCase(value) as SnakeCase<T>
}
