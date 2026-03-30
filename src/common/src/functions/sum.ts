import { Decimal } from 'decimal.js'
import { toPrecision } from '#common'

export const sum = (valueA: number, valueB: number, precision = 5): number => {
  const decimalA = Decimal(valueA)
  const decimalB = Decimal(valueB)

  if (decimalA.isNaN() && decimalB.isNaN()) {
    return 0
  }

  if (decimalA.isNaN()) {
    return decimalB.toNumber()
  }

  if (decimalB.isNaN()) {
    return decimalA.toNumber()
  }

  return toPrecision(decimalA.add(decimalB).toNumber(), precision)
}
