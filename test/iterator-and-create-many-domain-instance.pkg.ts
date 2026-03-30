import { Iterator } from '../src/core/iterator'

describe('DDD Iterator', () => {
  it('iterates forward and backward with default behavior', () => {
    const iterator = Iterator.create({ initialData: [1, 2, 3] })

    expect(iterator.next()).toBe(1)
    expect(iterator.next()).toBe(2)
    expect(iterator.prev()).toBe(1)
    expect(iterator.prev()).toBeNull()
  })

  it('returns current item when reverting direction if configured', () => {
    const iterator = Iterator.create({
      initialData: [1, 2],
      returnCurrentOnReversion: true
    })

    expect(iterator.next()).toBe(1)
    expect(iterator.next()).toBe(2)
    expect(iterator.prev()).toBe(2)
    expect(iterator.prev()).toBe(1)
  })

  it('restarts from beginning when restartOnFinish is enabled', () => {
    const iterator = Iterator.create({
      initialData: ['a', 'b'],
      restartOnFinish: true
    })

    expect(iterator.next()).toBe('a')
    expect(iterator.next()).toBe('b')
    expect(iterator.next()).toBe('a')
  })
})
