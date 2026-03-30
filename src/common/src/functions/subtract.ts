import { Decimal } from 'decimal.js'

/**
 * Subtracts two numbers and returns the result with a specified precision.
 *
 * @param valueA - The first number to subtract.
 * @param valueB - The second number to subtract.
 * @param precision - The precision to round the result to.
 * @returns The result of the subtraction.
 */
export const subtract = (valueA: number, valueB: number, precision = 5): number => {
  const decimalA = Decimal(valueA)
  const decimalB = Decimal(valueB)

  if (decimalA.isNaN() || decimalB.isNaN()) {
    return 0
  }

  if (decimalA.isNaN()) {
    return decimalB.toNumber() * -1
  }

  if (decimalB.isNaN()) {
    return decimalA.toNumber()
  }

  return decimalA.sub(decimalB).toDecimalPlaces(precision).toNumber()
}
