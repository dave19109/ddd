import type { CreateManyDomain, CreateManyResult } from '../types'
import { DDDValidator } from '../utils/ddd-validator'
import { Iterator } from './iterator'

type DomainClassWithCreate = {
  name?: string
  create: (props: unknown) => unknown
}

const isDomainClassWithCreate = (value: unknown): value is DomainClassWithCreate => {
  if (typeof value !== 'function') {
    return false
  }

  return typeof (value as { create?: unknown }).create === 'function'
}

/**
 * @description Creates multiple domain instances at once from an array of class-property pairs.
 * Each element in the input data should contain a domain class and the props required to create an instance of it.
 *
 * - If the domain class does not have a static `create` method, a failure result is returned for that class.
 * - Otherwise, `createManyDomainInstances` attempts to create each instance, collecting the results.
 *
 * @param data An array of objects, each containing a domain class and properties for instance creation.
 * @returns A `CreateManyResult` object containing:
 *  - `data`: An iterator over the results of each instance creation attempt.
 *  - `result`: A combined `Result` indicating if all instances were created successfully or if any failed.
 *
 * @example
 * ```typescript
 * const classes = [
 *   Class(User, { name: "Alice", age: 30 }),
 *   Class(Product, { title: "Book", price: 9.99 }),
 *   Class(Order, { userId: "some-user-id", items: [] })
 * ];
 *
 * const { data, result } = createManyDomainInstances(classes);
 * if (result.isOk()) {
 *   const userResult = data.next().value;
 *   const productResult = data.next().value;
 *   const orderResult = data.next().value;
 *
 *   // userResult, productResult, and orderResult are all successful `Result` instances.
 * } else {
 *   console.error("Failed to create some domain instances:", result.error);
 * }
 * ```
 */
export const createManyDomainInstances = (data: CreateManyDomain): CreateManyResult => {
  const validator = DDDValidator.create()
  const results: unknown[] = []

  if (validator.isArray(data)) {
    for (const domainInfo of data) {
      const domainClassCandidate = domainInfo.class
      if (!isDomainClassWithCreate(domainClassCandidate)) {
        throw new Error(
          `No static 'create' method found in class ${(domainClassCandidate as { name?: string })?.name}.`
        )
      }

      const domainClass = domainClassCandidate
      const payload = domainClass.create(domainInfo.props)
      results.push(payload)
    }
  }

  const iterator = Iterator.create({ initialData: results, returnCurrentOnReversion: true })

  return { data: iterator, result: results }
}
