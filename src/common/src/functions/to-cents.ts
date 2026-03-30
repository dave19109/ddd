import { Decimal } from 'decimal.js'

/**
 * Converts
 *
 */
export const toCents = (value: number): number => {
  const decimalValue = Decimal(value)
  if (decimalValue.isNaN()) {
    return value
  }
  return decimalValue.mul(100).toNumber()
}
