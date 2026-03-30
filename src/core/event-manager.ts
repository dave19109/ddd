import type { EventName } from '../types'

/**
 * @abstract
 * @description Abstract class defining the structure of an event manager.
 * Used to manage the lifecycle of events such as subscription, dispatch, and removal.
 */
export abstract class EventManager {
  /**
   * @description Subscribes a callback function to a specific event.
   * @param eventName The name of the event to subscribe to.
   * @param fn The callback function to execute when the event is triggered.
   */
  abstract subscribe(eventName: EventName, fn: (event: Event) => void | Promise<void>): void

  /**
   * @description Checks if a specific event exists in the event manager.
   * @param eventName The name of the event to check.
   * @returns True if the event exists, false otherwise.
   */
  abstract exists(eventName: EventName): boolean

  /**
   * @description Removes a specific event from the event manager.
   * @param eventName The name of the event to remove.
   * @returns True if the event was successfully removed, false otherwise.
   */
  abstract removerEvent(eventName: EventName): boolean

  /**
   * @description Dispatches an event, triggering all associated callbacks.
   * @param eventName The name of the event to dispatch.
   * @param args Optional arguments to pass to the event handlers.
   */
  abstract dispatchEvent(eventName: EventName, ...args: unknown[]): void
}
