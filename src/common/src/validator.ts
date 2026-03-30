import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
export class Validator {
  static create(): Validator {
    return new Validator()
  }

  /**
   * @description Checks if a character at a specified index is a special character based on ASCII codes.
   * @param input The input string to check.
   * @param index The index of the character.
   * @returns {boolean} True if the character is a special character, false otherwise.
   */
  private static isSpecialChar(input: string, index: number): boolean {
    const asciiCode = input.charCodeAt(index)
    return (
      (asciiCode >= 33 && asciiCode <= 47) ||
      (asciiCode >= 58 && asciiCode <= 64) ||
      (asciiCode >= 91 && asciiCode <= 96) ||
      (asciiCode >= 123 && asciiCode <= 126)
    )
  }

  /**
   * @description Checks if the provided value is an array.
   * @param props The value to check.
   * @returns {props is unknown[]} True if the value is an array, false otherwise.
   */
  isArray(props: unknown): props is unknown[] {
    return Array.isArray(props)
  }

  /**
   * @description Checks if the provided value is a string.
   * @param props The value to check.
   * @returns {props is string} True if the value is a string, false otherwise.
   */
  isString(props: unknown): props is string {
    return typeof props === 'string'
  }

  /**
   * @description Checks if the provided value is a number.
   * @param props The value to check.
   * @returns {props is number} True if the value is a number, false otherwise.
   */
  isNumber(props: unknown): props is number {
    return typeof props === 'number'
  }

  /**
   * @description Checks if the provided value is a boolean.
   * @param props The value to check.
   * @returns {props is boolean} True if the value is a boolean, false otherwise.
   */
  isBoolean(props: unknown): props is boolean {
    return typeof props === 'boolean'
  }

  /**
   * @description Checks if the provided value is a function.
   * @param props The value to check.
   * @returns {boolean} True if the value is a function, false otherwise.
   */
  isFunction(props: unknown): boolean {
    return typeof props === 'function'
  }

  /**
   * @description Checks if the provided value is a symbol.
   * @param props The value to check.
   * @returns {boolean} True if the value is a symbol, false otherwise.
   */
  isSymbol(props: unknown): props is symbol {
    return typeof props === 'symbol'
  }

  /**
   * @description Checks if the provided value is a date.
   * @param props The value to check.
   * @returns {props is Date} True if the value is a date, false otherwise.
   */
  isDate(props: unknown): props is Date {
    return props instanceof Date && !Number.isNaN(props.getTime())
  }

  /**
   * @description Checks if the provided value is null.
   * @param props The value to check.
   * @returns {boolean} True if the value is null, false otherwise.
   */
  isNull(props: unknown): ReturnType<typeof isNull> {
    return isNull(props)
  }

  /**
   * @description Checks if the provided value is undefined.
   * @param props The value to check.
   * @returns {boolean} True if the value is undefined, false otherwise.
   */
  isUndefined(props: unknown): ReturnType<typeof isUndefined> {
    return isUndefined(props)
  }

  /**
   * @description Checks if the provided value is empty. Works for strings, arrays, and objects.
   * @param props The value to check.
   * @returns {boolean} True if the value is empty, false otherwise.
   */
  isEmpty(props: unknown): ReturnType<typeof isEmpty> {
    return isEmpty(props)
  }

  /**
   * @description Checks if the provided value is defined (not null, undefined, or empty).
   * @param props The value to check.
   * @returns {boolean} True if the value is defined, false otherwise.
   */
  isDefined<T = unknown>(value: T): value is NonNullable<T> {
    if (this.isBoolean(value)) {
      return true
    }
    return !(this.isUndefined(value) || this.isNull(value) || this.isEmpty(value))
  }

  /**
   * @description Checks if the provided value is a number.
   * @param target The value to check.
   * @returns {object} An object with methods to check the number.
   */
  number(target: number) {
    return {
      isEqualTo: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target === value,
      isGreaterThan: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target > value,
      isLessThan: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target < value,
      isLessOrEqualTo: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target <= value,
      isGreaterOrEqualTo: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target >= value,
      isSafeInteger: (): boolean =>
        this.isNumber(target) && target <= Number.MAX_SAFE_INTEGER && target >= Number.MIN_SAFE_INTEGER,
      isPositive: (): boolean => this.isNumber(target) && target >= 0,
      isNegative: (): boolean => this.isNumber(target) && target < 0,
      isEven: (): boolean => this.isNumber(target) && target % 2 === 0,
      isInteger: (): boolean => this.isNumber(target) && target - Math.trunc(target) === 0,
      isBetween: (min: number, max: number): boolean => this.isNumber(target) && target < max && target > min,
      isBetweenOrEqual: (min: number, max: number): boolean => this.isNumber(target) && target <= max && target >= min
    }
  }

  /**
   * @description Checks if the provided value is a string.
   * @param target The value to check.
   * @returns {object} An object with methods to check the string.
   */
  string(target: string) {
    return {
      isUid: (): boolean => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        return this.isString(target) && uuidRegex.test(target)
      },
      isSpecialChar: (index = 0): boolean => this.isString(target[index]) && Validator.isSpecialChar(target, index),
      hasSpecialChar: (): boolean =>
        this.isString(target) && target.split('').some((char) => Validator.isSpecialChar(char, 0)),
      hasLengthGreaterThan: (length: number): boolean => this.isString(target) && target.length > length,
      hasLengthGreaterOrEqualTo: (length: number): boolean => this.isString(target) && target.length >= length,
      hasLengthLessThan: (length: number): boolean => this.isString(target) && target.length < length,
      hasLengthLessOrEqualTo: (length: number): boolean => this.isString(target) && target.length <= length,
      hasLengthEqualTo: (length: number): boolean => this.isString(target) && target.length === length,
      hasLengthBetween: (min: number, max: number): boolean =>
        this.isString(target) && target.length > min && target.length < max,
      hasLengthBetweenOrEqual: (min: number, max: number): boolean =>
        this.isString(target) && target.length >= min && target.length <= max,
      includes: (value: string): boolean => this.isString(target) && target.includes(value),
      isEmpty: (): boolean =>
        this.isUndefined(target) || this.isNull(target) || (this.isString(target) && target.trim() === ''),
      match: (regex: RegExp): boolean => {
        const safeRegex =
          regex.global || regex.sticky ? new RegExp(regex.source, regex.flags.replace(/[gy]/g, '')) : regex
        return safeRegex.test(target)
      },
      hasOnlyNumbers: (): boolean =>
        this.isString(target) &&
        target
          .split('')
          .map((n) => n.charCodeAt(0) >= 48 && n.charCodeAt(0) <= 57)
          .every((v) => v === true),
      hasOnlyLetters: (): boolean =>
        this.isString(target) &&
        target
          .toUpperCase()
          .split('')
          .map((n) => n.charCodeAt(0) >= 65 && n.charCodeAt(0) <= 90)
          .every((v) => v === true),
      isEqual: (value: string) => this.isString(target) && this.isString(value) && target === value
    }
  }

  date(target: Date) {
    return {
      isBeforeThan: (value: Date): boolean =>
        this.isDate(target) && this.isDate(value) && target.getTime() < value.getTime(),
      isBeforeOrEqualTo: (value: Date): boolean =>
        this.isDate(target) && this.isDate(value) && target.getTime() <= value.getTime(),
      isAfterNow: (): boolean => this.isDate(target) && target.getTime() > Date.now(),
      isBeforeNow: (): boolean => this.isDate(target) && target.getTime() < Date.now(),
      isBetween: (start: Date, end: Date): boolean =>
        this.isDate(target) && target.getTime() > start.getTime() && target.getTime() < end.getTime(),
      isWeekend: (): boolean =>
        (this.isDate(target) && target.getDay() === 0) || (this.isDate(target) && target.getDay() === 6),
      isAfterThan: (value: Date): boolean =>
        this.isDate(target) && this.isDate(value) && target.getTime() > value.getTime(),
      isAfterOrEqualTo: (value: Date): boolean =>
        this.isDate(target) && this.isDate(value) && target.getTime() >= value.getTime()
    }
  }
}
