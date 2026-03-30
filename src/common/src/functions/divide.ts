import { Decimal } from 'decimal.js'
import { toPrecision } from '#common'

/**
 * Divides two numbers and returns the result with a specified precision.
 *
 * @param valueA - The first number to divide.
 * @param valueB - The second number to divide.
 * @param precision - The precision to round the result to.
 * @returns The result of the division.
 */
export const divide = (valueA: number, valueB: number, precision = 5): number => {
  const decimalA = Decimal(valueA)
  const decimalB = Decimal(valueB)

  if (decimalA.isNaN() || decimalB.isNaN() || decimalB.isZero()) {
    return 0
  }

  return toPrecision(decimalA.div(decimalB).toNumber(), precision)
}
