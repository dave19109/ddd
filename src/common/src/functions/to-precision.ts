import { Decimal } from 'decimal.js'

/**
 * Converts a number or string to a number with a specified precision.
 *
 * @param value - The number or string to convert.
 * @param precision - The precision to convert to.
 * @returns The converted number.
 */
export const toPrecision = (value: number | string, precision: number): number => {
  const decimalValue = Decimal(value)

  if (decimalValue.isNaN()) {
    return value as number
  }

  if (precision <= 0) {
    throw new Error('Precision must be greater than or equal to 1')
  }

  return decimalValue.toDecimalPlaces(precision).toNumber()
}
