import toStringLodash from 'lodash/toString'
import { Validator } from '#common'
import { ID } from '../core/id'

type EntityLike = {
  id: unknown
  props: unknown
  isNew: () => boolean
}

type AggregateLike = EntityLike & {
  addEvent: (...args: unknown[]) => void
  dispatchEvent: (...args: unknown[]) => void | Promise<void>
}

type ValueObjectLike = {
  props: unknown
  isEqual: (other: unknown) => boolean
}

export class DDDValidator extends Validator {
  private hasObjectShape(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
  }

  private hasEntityLikeShape(value: unknown): value is EntityLike {
    if (!this.hasObjectShape(value)) {
      return false
    }

    const candidate = value as Record<string, unknown>
    return 'id' in candidate && 'props' in candidate && typeof candidate.isNew === 'function'
  }

  /**
   * @description Checks if the value is an instance of `ID`.
   * @param value The value to check.
   * @returns `true` if the value is an instance of `ID`, `false` otherwise.
   */
  isID(value: unknown): value is ID<string> {
    return value instanceof ID
  }

  /**
   * @description Checks if the provided value is an entity (but not an aggregate).
   * @param props The value to check.
   * @returns {boolean} True if the value is an entity, false otherwise.
   */
  isEntity(props: unknown): props is EntityLike {
    return this.hasEntityLikeShape(props) && !this.isAggregate(props)
  }

  /**
   * @description Checks if the provided value is an aggregate.
   * @param props The value to check.
   * @returns {boolean} True if the value is an aggregate, false otherwise.
   */
  isAggregate(props: unknown): props is AggregateLike {
    if (!this.hasEntityLikeShape(props)) {
      return false
    }

    const candidate = props as Record<string, unknown>
    return typeof candidate.addEvent === 'function' && typeof candidate.dispatchEvent === 'function'
  }

  /**
   * @description Checks if the provided value is a value object.
   * @param props The value to check.
   * @returns {boolean} True if the value is a value object, false otherwise.
   */
  isValueObject(props: unknown): props is ValueObjectLike {
    if (!this.hasObjectShape(props)) {
      return false
    }

    const candidate = props as Record<string, unknown>
    const hasValueObjectShape = 'props' in candidate && typeof candidate.isEqual === 'function'
    return hasValueObjectShape && !this.isEntity(props) && !this.isAggregate(props)
  }

  /**
   * @description Checks if the provided value is an object, excluding arrays, entities, aggregates, and value objects.
   * @param props The value to check.
   * @returns {boolean} True if the value is an object, false otherwise.
   */
  isObject(props: unknown): boolean {
    const isObj = typeof props === 'object'
    if (!isObj || props === null) {
      return false
    }
    if (toStringLodash(props) === toStringLodash({})) {
      return true
    }
    // if (stringify(props) === stringify({})) return true;
    const hasKeys = Object.keys(props).length > 0
    const isNotArray = !this.isArray(props)
    const isNotEntity = !this.isEntity(props)
    const isNotAggregate = !this.isAggregate(props)
    const isNotValueObject = !this.isValueObject(props)
    const isNotId = !this.isID(props)
    return hasKeys && isNotAggregate && isNotArray && isNotEntity && isNotValueObject && isNotId
  }

  static create(): DDDValidator {
    return new DDDValidator()
  }
}
