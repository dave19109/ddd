import { ID } from '../src/core/id'

describe('DDD ID', () => {
  it('creates a new id when no value is provided', () => {
    const id = ID.create()

    expect(id.isNew()).toBe(true)
    expect(id.value()).toBeTruthy()
    expect(id.isShort()).toBe(false)
  })

  it('creates a stable id from provided value', () => {
    const id = ID.create('custom-id')

    expect(id.isNew()).toBe(false)
    expect(id.value()).toBe('custom-id')
  })

  it('converts to short id preserving 16 chars uppercase format', () => {
    const id = ID.create('abc-123')
    const before = id.createdAt().getTime()

    const shortId = id.toShort()

    expect(shortId.value()).toHaveLength(16)
    expect(shortId.value()).toMatch(/^[A-Z0-9]+$/)
    expect(shortId.isShort()).toBe(true)
    expect(shortId.createdAt().getTime()).toBeGreaterThanOrEqual(before)
  })

  it('supports clone and cloneAsNew semantics', () => {
    const id = ID.create('shared')
    const clone = id.clone()
    const cloneAsNew = id.cloneAsNew()

    expect(clone.value()).toBe('shared')
    expect(clone.isNew()).toBe(false)
    expect(cloneAsNew.value()).toBe('shared')
    expect(cloneAsNew.isNew()).toBe(true)
  })

  it('builds short ids directly from factory', () => {
    const short = ID.short()

    expect(short.isShort()).toBe(true)
    expect(short.isNew()).toBe(true)
  })
})
