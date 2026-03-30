import type {
  _GettersAndSetters,
  CreateManyDomain,
  CreateManyResult,
  GettersAndSettersSettings,
  ParentName
} from '../types'
import { DDDValidator } from '../utils/ddd-validator'
import { createManyDomainInstances } from './create-many-domain-instance'
import { ID } from './id'

/**
 * @description GettersAndSetters provides a foundational mechanism for retrieving and updating properties
 * of domain objects (like Entities or Value Objects). It enables property validation and gives control
 * over whether getters or setters are active. When integrated with Entities or Value Objects, this class
 * ensures that changes to domain properties follow defined validation rules.
 */
export class GettersAndSetters<Props> implements _GettersAndSetters<Props> {
  protected readonly validator: DDDValidator = DDDValidator.create()
  protected static validator: DDDValidator = DDDValidator.create()
  protected readonly parentName: ParentName = 'ValueObject'

  protected config: GettersAndSettersSettings = { disableGetters: false, disableSetters: false }

  constructor(
    protected props: Props,
    parentName: ParentName,
    config?: GettersAndSettersSettings
  ) {
    this.validator = DDDValidator.create()
    GettersAndSetters.validator = DDDValidator.create()
    this.parentName = parentName
    this.config.disableGetters = !!config?.disableGetters
    this.config.disableSetters = !!config?.disableSetters
  }

  /**
   * @description Creates multiple domain instances at once.
   *
   * @param data An array of options that includes class constructors and properties.
   * @returns An object containing:
   *  - `result`: A combined result indicating overall success or failure.
   *  - `data`: An iterator of Result objects, each for an attempted instance creation.
   *
   * @example
   * ```typescript
   * const { result, data } = ValueObject.createMany([
   *   Class<AgeProps>(Age, props),
   *   Class<NameProps>(Name, props),
   *   Class<PriceProps>(Price, props)
   * ]);
   *
   * if (result.isOk()) {
   *   const ageResult = data.next().value;
   *   const nameResult = data.next().value;
   *   const priceResult = data.next().value;
   *
   *   console.log(ageResult.value().get('value')); // e.g. 21
   * }
   * ```
   */
  static createMany<Props>(data: CreateManyDomain): CreateManyResult<Props> {
    return createManyDomainInstances(data) as CreateManyResult<Props>
  }

  /**
   * @description Validates the value before setting or changing a property.
   * Subclasses can override this method to implement custom validation rules.
   *
   * @param _value The property value to validate.
   * @param _key The property key.
   * @returns `true` if the value is considered valid; `false` otherwise.
   *
   * @example
   * ```typescript
   * interface Props {
   *   value: string;
   *   age: number;
   * }
   *
   * class StringVo extends ValueObject<Props> {
   *   private constructor(props: Props) { super(props) }
   *
   *   validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
   *     const options = {
   *       value: (val: string) => val.length < 15,
   *       age:   (val: number) => val > 0
   *     }
   *     return options[key](value);
   *   }
   *
   *    static create(props: Props): IResult<ValueObject<Props>, string> {
   *     return Result.Ok(new StringVo(props));
   *   }
   * }
   * ```
   */
  validation(_value: unknown, _key?: unknown): boolean
  validation(_value: unknown, _key: unknown): boolean
  validation<Key extends keyof Props>(_value: Props[Key], _key: Key): boolean {
    return true
  }

  /**
   * @description Gets the name of the instance.
   * @returns The name of the instance.
   */
  private getInstanceName(): string {
    return Reflect.getPrototypeOf(this)?.constructor.name ?? this.constructor.name
  }

  /**
   * @description Touches the updatedAt property if the instance is an entity.
   * @returns `true` if the updatedAt property was successfully touched, otherwise `false`.
   */
  private touchUpdatedAtIfEntity(): void {
    if (this.parentName === 'Entity') {
      this.props = { ...this.props, updatedAt: new Date() }
    }
  }

  /**
   * @description Validates the set operation.
   * @param key The property key to validate.
   * @param value The value to validate.
   * @param validation An optional validation function.
   * @returns `true` if the value was successfully validated, otherwise throws an error.
   */
  private validateSetOperation<Key extends keyof Props>(
    key: Key,
    value: Props[Key],
    validation?: (value: Props[Key]) => boolean
  ): void {
    const instanceName = this.getInstanceName()

    if (this.config.disableSetters) {
      throw new Error(
        `Attempted to set value "${value}" for key "${String(key)}" but setters are disabled on ${instanceName}.`
      )
    }

    if (typeof validation === 'function' && !validation(value)) {
      throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instanceName}.`)
    }

    if (!this.validation(value, key)) {
      throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instanceName}.`)
    }
  }

  /**
   * @description Handles the update of the entity ID.
   * @param key The property key to update.
   * @param value The value to update.
   * @returns `true` if the entity ID was successfully updated, otherwise `false`.
   */
  private handleEntityIdUpdate<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {
    if (key !== 'id' || this.parentName !== 'Entity') {
      return false
    }

    const self = this as unknown as {
      _id: { value: () => string }
      props: Record<string, unknown> & { id?: string; updatedAt?: Date }
    }

    if (this.validator.isString(value) || this.validator.isNumber(value)) {
      self._id = ID.create(value)
      self.props.id = self._id.value()
      this.touchUpdatedAtIfEntity()
      return true
    }

    if (this.validator.isID(value)) {
      self._id = value as unknown as ID<string>
      self.props.id = self._id.value()
      this.touchUpdatedAtIfEntity()
      return true
    }

    return false
  }

  /**
   * @description Applies the set operation to the property.
   * @param key The property key to set.
   * @param value The value to set.
   * @param validation An optional validation function.
   * @returns `true` if the value was successfully set, otherwise throws an error.
   */
  private applySetOperation<Key extends keyof Props>(
    key: Key,
    value: Props[Key],
    validation?: (value: Props[Key]) => boolean
  ): boolean {
    this.validateSetOperation(key, value, validation)

    if (this.handleEntityIdUpdate(key, value)) {
      return true
    }

    this.props[key] = value
    this.touchUpdatedAtIfEntity()
    return true
  }

  /**
   * @description Sets a property value after validating it. Returns a chained method
   * (`to`) that accepts the new value and an optional validation function.
   *
   * @param key The property key to set.
   * @returns An object with a `to` function to finalize the property assignment.
   *
   * @example
   * ```typescript
   * entity.set('age').to(30, (age) => age > 0);
   * ```
   */
  set<Key extends keyof Props>(key: Key) {
    return {
      /**
       * @description Assigns the provided value to the specified property if it passes both
       * the optional provided validation function and the class's `validation` method.
       *
       * @param value The value to assign to the property.
       * @param validation An optional validation function that returns `true` if the value is valid.
       * @returns `true` if the value was successfully assigned, otherwise throws an error.
       *
       * @example
       * ```typescript
       * entity.set('name').to('Alice', (value) => value.length > 0);
       * ```
       */
      to: (value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean => {
        return this.applySetOperation(key, value, validation)
      }
    }
  }

  /**
   * @description Changes the value of a specified property directly (without the chained approach).
   * Validates the value using both the provided validation function (if any) and the class's `validation` method.
   *
   * @param key The property key to change.
   * @param value The new value for the property.
   * @param validation An optional validation function that returns `true` if the value is valid.
   * @returns `true` if the value was successfully changed, otherwise throws an error.
   *
   * @example
   * ```typescript
   * entity.change('age', 25, (age) => age > 0);
   * ```
   */
  change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean {
    return this.applySetOperation(key, value, validation)
  }

  /**
   * @description Retrieves the value of a specified property.
   *
   * @param key The property key to retrieve.
   * @returns The property's value as a read-only value.
   *
   * @throws Will throw an error if getters are disabled.
   *
   * @example
   * ```typescript
   * const age = entity.get('age');
   * console.log(age); // e.g. 30
   * ```
   */
  get<Key extends keyof Props>(key: Key): Props[Key] {
    if (this.config.disableGetters) {
      const instance = Reflect.getPrototypeOf(this)
      throw new Error(
        `Attempted to get key "${String(key)}" but getters are disabled on ${instance?.constructor.name}.`
      )
    }
    if (typeof this.props === 'object') {
      return this.props?.[key] ?? (null as unknown as Props[Key])
    }
    return this.props as unknown as Props[Key]
  }

  /**
   * @description Returns the raw (immutable) properties object of the domain instance.
   *
   * @returns A frozen, read-only view of the properties.
   *
   * @example
   * ```typescript
   * const raw = entity.getRaw();
   * console.log(raw); // returns a frozen object with all properties
   * ```
   */
  getRaw(): Readonly<Props> {
    return Object.freeze(this.props)
  }
}
