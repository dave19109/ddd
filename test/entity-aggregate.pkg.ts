import { Aggregate } from '../src/core/aggregate'
import { Entity } from '../src/core/entity'

describe('DDD Entity', () => {
  it('creates entity with provided id', () => {
    const entity = Entity.create({ id: 'entity-1', name: 'Alice' }) as Entity<{ id: string; name: string }>

    expect(entity.id.value()).toBe('entity-1')
    expect(entity.isNew()).toBe(false)
  })

  it('compares entities by id and props', () => {
    const first = Entity.create({ id: 'same-id', name: 'Order' }) as Entity<{ id: string; name: string }>
    const second = Entity.create({ id: 'same-id', name: 'Order' }) as Entity<{ id: string; name: string }>
    const third = Entity.create({ id: 'different-id', name: 'Order' }) as Entity<{ id: string; name: string }>

    expect(first.isEqual(second)).toBe(true)
    expect(first.isEqual(third)).toBe(false)
  })

  it('clones entity overriding selected fields', () => {
    const entity = Entity.create({ id: 'clone-id', name: 'Original', status: 'active' }) as Entity<{
      id: string
      name: string
      status: string
    }>
    const clone = entity.clone({ status: 'disabled' })

    expect(clone.id.value()).toBe('clone-id')
    expect(clone.get('name')).toBe('Original')
    expect(clone.get('status')).toBe('disabled')
  })

  it('generates a hash code containing entity class and id', () => {
    const entity = Entity.create({ id: 'hash-id', name: 'User' }) as Entity<{ id: string; name: string }>

    expect(entity.hashCode().value()).toContain('[Entity@Entity]:hash-id')
  })
})

describe('DDD Aggregate', () => {
  it('creates aggregate with initial empty event metrics', () => {
    const aggregate = Aggregate.create({ id: 'agg-1', name: 'Cart' }) as Aggregate<{ id: string; name: string }>

    expect(aggregate.eventsMetrics).toEqual({
      current: 0,
      total: 0,
      dispatch: 0
    })
  })

  it('dispatches a single event and updates metrics', () => {
    const aggregate = Aggregate.create({ id: 'agg-2', name: 'Cart' }) as Aggregate<{ id: string; name: string }>
    const handler = jest.fn()

    aggregate.addEvent('cart:created', handler)
    aggregate.dispatchEvent('cart:created')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(aggregate.eventsMetrics).toEqual({
      current: 0,
      total: 1,
      dispatch: 1
    })
  })

  it('dispatches all events ordered by ascending priority', async () => {
    const aggregate = Aggregate.create({ id: 'agg-3', name: 'Cart' }) as Aggregate<{ id: string; name: string }>
    const dispatched: string[] = []

    aggregate.addEvent(
      'cart:second',
      (_aggregate, [event]): void => {
        dispatched.push(event.eventName)
      },
      { priority: 2 }
    )
    aggregate.addEvent(
      'cart:first',
      (_aggregate, [event]): void => {
        dispatched.push(event.eventName)
      },
      { priority: 1 }
    )

    await aggregate.dispatchAll()

    expect(dispatched).toEqual(['cart:first', 'cart:second'])
    expect(aggregate.eventsMetrics).toEqual({
      current: 0,
      total: 2,
      dispatch: 2
    })
  })

  it('deletes queued events by name', () => {
    const aggregate = Aggregate.create({ id: 'agg-4', name: 'Cart' }) as Aggregate<{ id: string; name: string }>
    const handler = jest.fn()

    aggregate.addEvent('cart:item-added', handler)
    aggregate.addEvent('cart:item-removed', handler)

    const deleted = aggregate.deleteEvent('cart:item-added')

    expect(deleted).toBe(1)
    expect(aggregate.eventsMetrics.current).toBe(1)
  })

  describe('Aggregate object serialization', () => {
    it('with enum value props', () => {
      enum Name {
        CART = 'cart',
        ORDER = 'order',
        USER = 'user'
      }
      const aggregate = Aggregate.create({ id: 'agg-2', name: Name.CART }) as Aggregate<{ id: string; name: Name }>

      const obj = aggregate.toObject()

      expect(obj.name).toBe(Name.CART)
    })
  })
})
