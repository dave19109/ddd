/** biome-ignore-all lint/complexity/noBannedTypes: No need to transform nullish type */
/** biome-ignore-all lint/suspicious/noConfusingVoidType: No need to transform void type */

import type { PartialDeep } from 'type-fest'

// biome-ignore lint/suspicious/noExplicitAny: No need to transform any type
export type AnyValue = any
/**
 * Any object type
 */
export type AnyObject = Record<string, AnyValue>
/**
 * Any array type
 */
export type AnyArray = unknown[]
/**
 * Nullish type
 * @param T - The type to make nullish
 * @returns The nullish type
 */
export type Nullish<T> = T | null | undefined
/**
 * A utility type that makes specific keys of a type optional.
 *
 * @template T The original type.
 * @template K The keys of T to be made optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & PartialDeep<Pick<T, K>>
/**
 * Nullable type
 * @param T - The type to make nullable
 * @returns The nullable type
 */
export type Nullable<T> = T | null

/**
 * Primitive types that are not recursively transformed.
 */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint

/**
 * Built-in types that are excluded from recursive transformations.
 */
export type BuiltIns = Primitive | void | Date | RegExp

/**
 * Date units
 */
export type DateUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

/** Options for calculations, such as specifying precision. */
export type CalcOpt = { fractionDigits: number }
