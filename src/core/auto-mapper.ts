import type { AnyValue } from '#common'
import type { _AutoMapper, _Entity, _ValueObject, AutoMapperSerializer, EntityMapperPayload } from '../types'
import { DDDValidator } from '../utils/ddd-validator'

type DomainEntityLike = {
  id?: { value: () => string }
  props?: Record<string, unknown>
}

/**
 * Converts domain resources (entities/value objects) into plain serializable data.
 */
export class AutoMapper<Props> implements _AutoMapper<Props> {
  private readonly validator: DDDValidator = DDDValidator.create()

  private serialize(value: unknown): unknown {
    if (value === null || typeof value === 'undefined') {
      return value
    }

    if (
      this.validator.isBoolean(value) ||
      this.validator.isNumber(value) ||
      this.validator.isString(value) ||
      this.validator.isDate(value)
    ) {
      return value
    }

    if (this.validator.isSymbol(value)) {
      return value.description
    }

    if (this.validator.isID(value)) {
      return value.value()
    }

    if (this.validator.isArray(value)) {
      return value.map((item) => this.serialize(item))
    }

    if (this.validator.isEntity(value) || this.validator.isAggregate(value)) {
      return this.serializeEntity(value as unknown as DomainEntityLike)
    }

    if (this.validator.isValueObject(value)) {
      return this.serializeValueObject(value as AnyValue)
    }

    if (this.validator.isObject(value)) {
      const entries = Object.entries(value).map(([key, nested]) => [key, this.serialize(nested)])
      return Object.fromEntries(entries)
    }

    return value
  }

  private serializeValueObject(valueObject: _ValueObject<unknown>): unknown {
    const valueObjectWithProps = valueObject as { props?: unknown }
    return this.serialize(valueObjectWithProps.props)
  }

  private serializeEntity(entity: DomainEntityLike): Record<string, unknown> {
    const props = entity.props ?? {}

    const result: Record<string, unknown> = {
      id: entity.id?.value() ?? '',
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    }

    for (const [key, value] of Object.entries(props)) {
      result[key] = this.serialize(value)
    }

    return result
  }

  valueObjectToObj(valueObject: _ValueObject<Props>): AutoMapperSerializer<Props> {
    return this.serializeValueObject(valueObject as _ValueObject<unknown>) as AutoMapperSerializer<Props>
  }

  entityToObj(entity: _Entity<Props>): AutoMapperSerializer<Props> & EntityMapperPayload {
    return this.serializeEntity(entity as unknown as DomainEntityLike) as AutoMapperSerializer<Props> &
      EntityMapperPayload
  }
}
