/** biome-ignore-all lint/complexity/noBannedTypes: Not need */
/** biome-ignore-all lint/suspicious/noExplicitAny: Not need */
import type { AnyObject, BuiltIns, ReadonlyDeep } from '#common'
import type { Entity } from './core/entity'
import type { EventManager } from './core/event-manager'
import type { ValueObject } from './core/value-object'

/**
 * @interface
 * @description Represents a unique identifier (UID) with methods for manipulation and comparison.
 * @template T The type of the UID's value (default: string).
 */
export interface UID<T = string> {
  toShort(): UID<string>
  value(): string
  isNew(): boolean
  createdAt(): Date
  isShort(): boolean
  equal(id: UID<string>): boolean
  isEqual(id: UID<string>): boolean
  deepEqual(id: UID<string>): boolean
  cloneAsNew(): UID<string>
  clone(): UID<T>
}

/**
 * @interface
 * @description Configuration for value object settings.
 */
export interface _VoSettings {
  /** Disables getters if set to true. */
  disableGetters?: boolean
}

/** Extends `_VoSettings` with additional options for setters. */
export interface GettersAndSettersSettings extends _VoSettings {
  /** Disables setters if set to true. */
  disableSetters?: boolean
}

export type GetKey<Props, Key extends keyof Props = keyof Props> = Props extends BuiltIns
  ? 'value'
  : Props extends symbol
    ? 'value'
    : Props extends unknown[]
      ? 'value'
      : Key

export type GetReturn<Props, Key extends keyof Props> = Props extends BuiltIns
  ? Props
  : Props extends symbol
    ? string
    : Props extends unknown[]
      ? Readonly<Props>
      : Props extends object
        ? Readonly<Props[Key]>
        : Props
/**
 * @description Retrieves the value of a specific property key from the domain object's properties.
 * @param key The property key to retrieve. For simple value objects (like strings, numbers, etc.),
 * you can use the `'value'` key to get the raw value.
 * @returns The value of the specified property. For complex objects, returns a read-only view of the property.
 * For simple value objects (e.g., primitives, symbols, arrays, dates), returns the direct value.
 * @throws Will throw an error if getters are disabled.
 */
export type GetFn<Props> = <Key extends keyof Props>(key: GetKey<Props, Key>) => GetReturn<Props, Key>
/**
 * Base interface for accessing raw properties or individual keys of an entity.
 * @template Props The type of the entity's properties.
 */
export interface _BaseGettersAndSetters<Props> {
  /**
   * Retrieves the value of a specified property key.
   * @param key The property key to retrieve.
   * @returns The value of the specified key, or the raw object if `Props` is a built-in type.
   */
  get: GetFn<Props>

  /**
   * Retrieves the raw properties of the entity.
   * @returns The raw properties of the entity.
   */
  getRaw(): Props
}

/**
 * Interface for managing getters and setters for properties.
 * @template Props The type of the properties.
 */
export interface _GettersAndSetters<Props> {
  /**
   * Sets a value for a specified property key.
   * @param key The property key to set.
   * @returns A setter function that applies the value and validates it.
   */
  set<Key extends keyof Props>(
    key: Key
  ): {
    to: (value: Props[Key], validation?: (value: Props[Key]) => boolean) => boolean
  }

  /**
   * Changes the value of a specified property key with optional validation.
   * @param key The property key to change.
   * @param value The new value to apply.
   * @param validation An optional function to validate the value.
   * @returns `true` if the value is successfully changed; otherwise `false`.
   */
  change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean

  /**
   * Retrieves the value of a specified property key.
   * @param key The property key to retrieve.
   * @returns The readonly value of the specified key.
   */
  get<Key extends keyof Props>(key: Key): Readonly<Readonly<Props[Key]>>

  /**
   * Validates a value for a specific property key.
   * @param value The value to validate.
   * @param key The property key associated with the value.
   * @returns `true` if the value is valid; otherwise `false`.
   */
  validation<Key extends keyof Props>(value: Props[Key], key: Props extends object ? Key : never): boolean
}

/** Union type representing the parent name of an entity or value object. */
export type ParentName = 'ValueObject' | 'Entity'

/**
 * @interface
 * @description Configuration options for creating an iterator.
 * @template T The type of items in the iterator.
 */
export interface ITeratorConfig<T> {
  initialData?: T[]
  returnCurrentOnReversion?: boolean
  restartOnFinish?: boolean
}

/**
 * @interface
 * @description Defines the operations supported by an iterator for managing sequential traversal of items.
 * @template T The type of items in the iterator.
 */
export interface _Iterator<T> {
  hasNext(): boolean
  hasPrev(): boolean
  next(): T
  prev(): T
  first(): T
  last(): T
  isEmpty(): boolean
  toFirst(): _Iterator<T>
  toLast(): _Iterator<T>
  toArray(): T[]
  clear(): _Iterator<T>
  addToEnd(data: T): _Iterator<T>
  add(data: T): _Iterator<T>
  addToStart(data: T): _Iterator<T>
  removeLast(): _Iterator<T>
  removeFirst(): _Iterator<T>
  total(): number
  clone(): _Iterator<T>
  removeItem(item: T): void
}

/**
 * Represents a data structure containing a class and its associated properties.
 */
export interface _ManyData {
  class: unknown
  props: unknown
}

/** Array of `_ManyData` objects, representing multiple domain instances. */
export type CreateManyDomain = _ManyData[]

/**
 * Represents the result of creating multiple domain instances.
 */
export interface CreateManyResult<T = unknown> {
  /** Iterator over the results of the creation process. */
  data: _Iterator<T>

  /** Combined result of the creation process. */
  result: T
}

/**
 * @interface
 * @description Represents an adapter that transforms one type to another.
 * @template F The input type.
 * @template T The output type.
 * @template E The error type (default: any).
 * @template M The metadata type (default: any).
 */
export interface _Adapter<F, T> {
  /** Builds the target type from the input type. */
  build(target: F): T
}

/**
 * @interface
 * @description Represents a simpler adapter for transforming objects.
 * @template A The input type.
 * @template B The output type.
 */
export interface Adapter<A = unknown, B = unknown> {
  /** Adapts a single item. */
  adaptOne(item: A): B

  /** Adapts multiple items (optional). */
  adaptMany?(items: A[]): B[]
}

/**
 * @description Represents the common properties for an entity.
 */
export type EntityProps = AnyObject | { id?: string; createdAt?: Date; updatedAt?: Date }

/**
 * @description Defines the shape of data used for mapping an entity's properties.
 */
export interface EntityMapperPayload {
  id: string // Unique identifier of the entity.
  createdAt: Date // The creation timestamp of the entity.
  updatedAt: Date // The last updated timestamp of the entity.
}

export type EntityMapperResult<T, Props> = T extends object
  ? T & EntityMapperPayload
  : ReadonlyDeep<AutoMapperSerializer<Props> & EntityMapperPayload>

type SerializerEntityReturnType<ThisEntity extends Entity<any>> = ReturnType<ThisEntity['getRaw']>
type SerializerValueObjectReturnType<ThisValueObject extends ValueObject<unknown>> = ReturnType<
  ThisValueObject['getRaw']
>
type SerializerArrayItem<Item> = Item extends { getRaw: (...args: never[]) => unknown }
  ? AutoMapperSerializer<ReturnType<Item['getRaw']>> & (Item extends Entity<any> ? EntityMapperPayload : {})
  : Item

/**
 * Serializes properties of entities and value objects into a nested structure.
 * @template Props The type of properties to serialize.
 */
export type AutoMapperSerializer<Props> = {
  [key in keyof Props]: Props[key] extends ValueObject<unknown>
    ? AutoMapperSerializer<SerializerValueObjectReturnType<Props[key]>>
    : Props[key] extends Entity<any>
      ? AutoMapperSerializer<SerializerEntityReturnType<Props[key]>> & EntityMapperPayload
      : Props[key] extends unknown[]
        ? SerializerArrayItem<Props[key][number]>[]
        : Props[key]
}

/**
 * @interface
 * @description Represents an entity with unique properties and lifecycle operations.
 * @template Props The type of the entity's properties.
 */
export interface _Entity<Props> {
  /** Converts the entity into an object, optionally using an adapter. */
  toObject<T>(adapter?: _Adapter<_Entity<Props>, unknown>): EntityMapperResult<T, Props>

  get id(): UID<string> // The unique identifier of the entity.
  hashCode(): UID<string> // Returns a hash code for the entity.
  isNew(): boolean // Checks if the entity is newly created.
  clone(): _Entity<Props> // Creates a clone of the entity.
}

/**
 * @interface
 * @description Represents a value object with cloning and transformation capabilities.
 * @template Props The type of the value object's properties.
 */
export interface _ValueObject<Props> {
  /** Clones the value object. */
  clone(): _ValueObject<Props>

  /** Converts the value object into a serializable format, optionally using an adapter. */
  toObject<T>(adapter?: _Adapter<this, T>): T extends {} ? T : ReadonlyDeep<AutoMapperSerializer<Props>>
}

/**
 * Interface for automatic mapping of entities and value objects to objects.
 * @template Props The type of properties to map.
 */
export interface _AutoMapper<Props> {
  /** Maps a value object to a serializable object. */
  valueObjectToObj(valueObject: _ValueObject<Props>): AutoMapperSerializer<Props>

  /** Maps an entity to a serializable object with metadata. */
  entityToObj(entity: _Entity<Props>): AutoMapperSerializer<Props> & EntityMapperPayload
}

/**
 * Interface for aggregate root behavior, extending entity capabilities.
 * @template Props The type of the aggregate's properties.
 */
export interface _Aggregate<Props> {
  /**
   * Converts the aggregate to a serializable object, optionally using an adapter.
   * @param adapter An optional adapter for transforming the aggregate.
   * @returns The serialized object with metadata.
   */
  toObject<T>(
    adapter?: _Adapter<this, T>
  ): T extends {} ? T & EntityMapperPayload : ReadonlyDeep<AutoMapperSerializer<Props> & EntityMapperPayload>

  /** The unique identifier of the aggregate. */
  get id(): UID<string>

  /** Generates a hash code for the aggregate. */
  hashCode(): UID<string>

  /** Checks if the aggregate is newly created. */
  isNew(): boolean

  /** Creates a deep clone of the aggregate. */
  clone(): _Entity<Props>

  /** Removes an event from the aggregate's event context. */
  deleteEvent(eventName: EventName): void

  /** Provides access to the aggregate's event management context. */
  context(): EventManager
}

export type EventName = `${string}:${string}`
/**
 * Interface for metrics tracking event-related data.
 */
export interface EventMetrics {
  current: number // The current number of active events.
  total: number // The total number of events.
  dispatch: number // The number of dispatched events.
}

/**
 * Parameters for configuring an event.
 */
export interface EventParams {
  eventName: EventName // The name of the event.
  options?: Options // Additional options for the event.
}

/**
 * Options for configuring an event.
 */
export interface Options {
  priority: number // The priority of the event.
}

/**
 * Interface representing the configuration of an event.
 * @template T The type associated with the event.
 */
export interface DEvent<T> {
  eventName: EventName // The name of the event.
  handler: Handler<T> // The function to handle the event.
  options: Options // Additional configuration options.
}

/** Arguments passed to event handlers. */
export type HandlerArgs<T> = [T, [DEvent<T>, ...any[]]]

/** Represents an asynchronous event handler. */
export type PromiseHandler<T> = (...args: HandlerArgs<T>) => Promise<void>

/** Represents a synchronous event handler. */
export type NormalHandler<T> = (...args: HandlerArgs<T>) => void

/** Represents an event handler, either synchronous or asynchronous. */
export type Handler<T> = PromiseHandler<T> | NormalHandler<T>

/**
 * Interface for metrics related to event management.
 */
export interface Metrics {
  totalEvents: () => number // Returns the total number of registered events.
  totalDispatched: () => number // Returns the total number of dispatched events.
}
