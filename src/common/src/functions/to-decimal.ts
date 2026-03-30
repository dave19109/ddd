import { Decimal } from 'decimal.js'

/**
 * Converts a number to a decimal.
 *
 * @param value - The number to convert.
 * @returns The converted decimal.
 */
export const toDecimal = (value: number): number => {
  const decimalValue = Decimal(value)

  if (decimalValue.isNaN()) {
    return value
  }

  return decimalValue.div(100).toNumber()
}
