import type { DEvent, EventParams, HandlerArgs } from '../types'

/**
 * Abstract class representing an event handler.
 * @template T - The type of the associated aggregate.
 */
export abstract class EventHandler<T> {
  constructor(readonly params: EventParams) {
    if (typeof params?.eventName !== 'string') {
      throw new Error('params.eventName is required as string')
    }
    this.dispatch = this.dispatch.bind(this)
  }

  /**
   * Dispatches the event to its handler.
   * @param aggregate - The associated aggregate instance.
   * @param args - Arguments for the event handler.
   * @returns A promise or void, depending on the handler's implementation.
   */
  abstract dispatch(aggregate: T, args: [DEvent<T>, unknown[]]): Promise<void> | void

  /**
   * Dispatches the event with additional handler arguments.
   * @param args - Additional arguments for the handler.
   * @returns A promise or void, depending on the handler's implementation.
   */
  abstract dispatch(...args: HandlerArgs<T>): Promise<void> | void
}
