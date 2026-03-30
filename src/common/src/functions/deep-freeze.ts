import cloneDeep from 'lodash/cloneDeep'
import type { ReadonlyDeep } from 'type-fest'
import type { AnyObject } from '../types'

function freezeRecursively(value: object, seen: WeakSet<object>): void {
  if (seen.has(value)) {
    return
  }

  seen.add(value)

  for (const key of Reflect.ownKeys(value)) {
    const nestedValue = (value as Record<PropertyKey, unknown>)[key]
    if (typeof nestedValue === 'object' && nestedValue !== null) {
      freezeRecursively(nestedValue, seen)
    }
  }

  Object.freeze(value)
}

/**
 * @description Recursively freezes an object to make it immutable. This prevents any modifications to the object or its nested properties.
 *
 * @typeParam T - The type of the object being frozen.
 *
 * @param obj The object to be deeply frozen. If the input is not an object, it is returned as is.
 *
 * @returns The same object, but deeply frozen to prevent further modifications.
 *
 * @example
 * ```typescript
 * const mutableObject = { a: 1, b: { c: 2 } };
 * const frozenObject = deepFreeze(mutableObject);
 *
 * frozenObject.a = 2; // This will throw a TypeError in strict mode.
 * frozenObject.b.c = 3; // This will also throw a TypeError.
 * ```
 */
export function deepFreeze<T extends AnyObject>(obj: T): ReadonlyDeep<T> {
  const clonedObject = cloneDeep(obj)
  freezeRecursively(clonedObject, new WeakSet<object>())
  return clonedObject as ReadonlyDeep<T>
}
