import { Decimal } from 'decimal.js'
import { toPrecision } from '#common'

/**
 * Multiplies two numbers and returns the result with a specified precision.
 *
 * @param valueA - The first number to multiply.
 * @param valueB - The second number to multiply.
 * @param precision - The precision to round the result to.
 * @returns The result of the multiplication.
 */
export const multiply = (valueA: number, valueB: number, precision = 5): number => {
  const decimalA = Decimal(valueA)
  const decimalB = Decimal(valueB)

  if (decimalA.isNaN() || decimalB.isNaN()) {
    return 0
  }

  if (decimalA.isNaN()) {
    return decimalB.toNumber()
  }

  if (decimalB.isNaN()) {
    return decimalA.toNumber()
  }

  return toPrecision(decimalA.mul(decimalB).toNumber(), precision)
}
