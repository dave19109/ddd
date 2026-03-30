import ServerEventManager from '../src/core/server-event-manager'

describe('ServerEventManager', () => {
  it('is a singleton', () => {
    const first = ServerEventManager.instance()
    const second = ServerEventManager.instance()

    expect(first).toBe(second)
  })

  it('subscribes, dispatches and removes an event', () => {
    const manager = ServerEventManager.instance()
    const eventName = `orders:created-${Date.now()}`
    const callback = jest.fn()

    manager.subscribe(eventName as `${string}:${string}`, callback)
    expect(manager.exists(eventName as `${string}:${string}`)).toBe(true)

    manager.dispatchEvent(eventName as `${string}:${string}`, { id: 1 })
    expect(callback).toHaveBeenCalledTimes(1)

    expect(manager.removerEvent(eventName as `${string}:${string}`)).toBe(true)
    expect(manager.exists(eventName as `${string}:${string}`)).toBe(false)
  })

  it('does not register duplicate subscriptions for the same event', () => {
    const manager = ServerEventManager.instance()
    const eventName = `payments:created-${Date.now()}`
    const callback = jest.fn()

    manager.subscribe(eventName as `${string}:${string}`, callback)
    manager.subscribe(eventName as `${string}:${string}`, callback)
    manager.dispatchEvent(eventName as `${string}:${string}`, { ok: true })

    expect(callback).toHaveBeenCalledTimes(1)
    manager.removerEvent(eventName as `${string}:${string}`)
  })
})
