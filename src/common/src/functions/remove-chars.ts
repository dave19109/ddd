/**
 * Removes all special characters from a string.
 *
 * @param target - The string to remove characters from.
 * @param IsChar - A function that checks if a character is a special character.
 * @returns The string with all special characters removed.
 */
export const removeChars = (target: string, IsChar: (char: string) => boolean) => {
  if (typeof target !== 'string') {
    return target
  }

  const chars = target.split('')
  const str = chars.reduce((prev, current) => {
    const isSpecialChar = IsChar(current)
    if (isSpecialChar) {
      return prev
    }
    return prev + current
  }, '')

  return str
}
