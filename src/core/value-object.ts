/** biome-ignore-all lint/complexity/noBannedTypes: Not need */

import type { ReadonlyDeep } from 'type-fest'
import { type AnyObject, deepFreeze } from '#common'
import type { _Adapter, _ValueObject, _VoSettings, Adapter, AutoMapperSerializer } from '../types'
import { AutoMapper } from './auto-mapper'
import { BaseGettersAndSetters } from './base-getters-and-setters'
import type { ID } from './id'

/**
 * @description A `ValueObject` represents a domain object characterized by its properties rather than a unique identifier.
 * Commonly used in domain-driven design, value objects are immutable and should be structurally equal
 * (two value objects with the same properties are considered equal).
 * This class provides functionalities to:
 * - Validate properties
 * - Compare equality between value objects
 * - Convert the value object into a plain object representation
 * - Clone the value object
 */
export class ValueObject<Props> extends BaseGettersAndSetters<Props> implements _ValueObject<Props> {
  protected autoMapper: AutoMapper<Props>

  /**
   * @description Initializes a new ValueObject instance.
   * @param props Properties that define the ValueObject.
   * @param config Optional configuration settings for getter/setter behavior.
   */
  constructor(props: Props, config?: _VoSettings) {
    super(props, config)
    this.autoMapper = new AutoMapper<Props>()
  }

  /**
   * @description Determines if the current value object is equal to another value object of the same type.
   * Equality is defined by comparing properties, excluding `createdAt` and `updatedAt`.
   * Primitive values (strings, numbers, booleans), dates, arrays, and IDs are compared by value.
   * Complex object structures are compared by their JSON-serialized form (excluding `createdAt` and `updatedAt`).
   *
   * @param other The value object to compare against.
   * @returns `true` if all considered properties are equal; `false` otherwise.
   */
  isEqual(other: this): boolean {
    const props = this.props
    const otherProps = other?.props

    const stringifyAndOmit = (obj: unknown): string => {
      if (!obj) {
        return ''
      }
      const { createdAt, updatedAt, ...cleanedProps } = obj as {
        createdAt: Date
        updatedAt: Date
        [key: string]: unknown
      }
      return JSON.stringify(cleanedProps)
    }

    if (this.validator.isString(props)) {
      return this.validator.string(props as string).isEqual(otherProps as string)
    }

    if (this.validator.isDate(props)) {
      return (props as Date).getTime() === (otherProps as Date)?.getTime()
    }

    if (this.validator.isArray(props) || this.validator.isFunction(props)) {
      return JSON.stringify(props) === JSON.stringify(otherProps)
    }

    if (this.validator.isBoolean(props)) {
      return props === otherProps
    }

    if (this.validator.isID(props)) {
      return props.value() === (otherProps as ID)?.value()
    }

    if (this.validator.isNumber(props) || typeof props === 'bigint') {
      return this.validator.number(props as number).isEqualTo(otherProps as number)
    }

    if (this.validator.isUndefined(props) || this.validator.isNull(props)) {
      return props === otherProps
    }

    if (this.validator.isSymbol(props)) {
      return props.description === (otherProps as Symbol)?.description
    }

    return stringifyAndOmit(props) === stringifyAndOmit(otherProps)
  }

  /**
   * @description Creates a new instance of the value object, optionally overriding properties.
   * Deep cloning is performed for object-based props, ensuring immutability of value objects.
   *
   * @param props Optional partial properties to override in the cloned instance.
   * @returns A new ValueObject instance with updated properties.
   */
  clone(props?: Props extends object ? Partial<Props> : never): this {
    const instance = Reflect.getPrototypeOf(this)
    if (typeof this.props === 'object' && !(this.props instanceof Date) && !Array.isArray(this.props)) {
      const _props = props ? { ...this.props, ...props } : { ...this.props }
      const args = [_props, this.config]
      if (instance === null) {
        throw new Error('Invalid instance to clone.')
      }
      return Reflect.construct(instance.constructor, args)
    }
    const args = [this.props, this.config]
    if (instance === null) {
      throw new Error('Invalid instance to clone.')
    }
    return Reflect.construct(instance.constructor, args)
  }

  /**
   * @description Converts the value object into a plain object or a format defined by the given adapter.
   * If no adapter is provided, the object is serialized using an `AutoMapper` and frozen to ensure immutability.
   *
   * @param adapter Optional adapter to transform the value object into a custom format.
   * @returns A deeply frozen, plain object representation of the value object properties.
   */
  toObject<T>(
    adapter?: Adapter<this, T> | _Adapter<this, T>
  ): T extends {} ? T : ReadonlyDeep<AutoMapperSerializer<Props>> {
    if (adapter && typeof (adapter as Adapter<this, T>)?.adaptOne === 'function') {
      return (adapter as Adapter<this, T>).adaptOne(this) as T extends {}
        ? T
        : ReadonlyDeep<AutoMapperSerializer<Props>>
    }
    if (adapter && typeof (adapter as _Adapter<this, T>)?.build === 'function') {
      return (adapter as _Adapter<this, T>).build(this) as T extends {} ? T : ReadonlyDeep<AutoMapperSerializer<Props>>
    }
    const serializedObject = this.autoMapper.valueObjectToObj(this) as ReadonlyDeep<AutoMapperSerializer<Props>>
    const frozenObject = deepFreeze(serializedObject as AnyObject)
    return frozenObject as T extends {} ? T : ReadonlyDeep<AutoMapperSerializer<Props>>
  }

  /**
   * @description Checks if a given value is considered valid for creating a ValueObject instance.
   * Subclasses can override this to apply additional validation logic.
   * @param value The value to validate.
   * @returns `true` if valid; `false` otherwise.
   */
  static isValid(value: unknown): boolean {
    return ValueObject.isValidProps(value)
  }

  /**
   * @description Validates the provided properties before creating a new value object instance.
   * @param props The properties to validate.
   * @returns `true` if the properties are valid; `false` otherwise.
   */
  static isValidProps(props: unknown): boolean {
    return !(ValueObject.validator.isUndefined(props) || ValueObject.validator.isNull(props))
  }

  /**
   * @description Intended to initialize a new value object instance with a given value.
   * This method should be implemented by subclasses as needed.
   * @param value The initial value or properties.
   * @throws An error indicating the method is not implemented.
   */
  static init(value: unknown): unknown {
    throw new Error('method not implemented: init', {
      cause: value
    })
  }

  static create(props: unknown): unknown
  /**
   * @description Creates a new ValueObject instance wrapped inside a `Result`.
   * Returns a failure `Result` if the provided properties are invalid.
   * @param props The properties needed to create the value object.
   * @returns A `Result` containing the new ValueObject on success, or a failure `Result` on invalid properties.
   */
  static create(props: AnyObject): unknown {
    if (!ValueObject.isValidProps(props)) {
      throw new Error(`Invalid props to create an instance of ${ValueObject.name}`)
    }
    return new ValueObject(props)
  }
}
