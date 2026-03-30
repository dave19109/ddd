import { removeChars } from './remove-chars'

/**
 * @description Removes all spaces from a given string. It utilizes the `RemoveChars` utility function,
 * passing a condition to identify spaces as the characters to remove.
 *
 * @param target The input string from which spaces will be removed.
 *
 * @returns A new string with all spaces removed. If the input is not a valid string, it will return the input as is.
 *
 * @example
 * ```typescript
 * const result = RemoveSpaces("Hello, World!");
 * console.log(result); // "Hello,World!"
 *
 * const anotherResult = RemoveSpaces("   Open  AI ");
 * console.log(anotherResult); // "OpenAI"
 * ```
 */
export const removeSpaces = (target: string): string => {
  return removeChars(target, (char: string) => char === ' ')
}
