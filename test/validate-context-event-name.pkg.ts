import validateContextEventName from '../src/utils/validate-context-event-name'

describe('validateContextEventName', () => {
  it('accepts names with context separator', () => {
    expect(() => validateContextEventName('user:created')).not.toThrow()
  })

  it('rejects names without context separator', () => {
    expect(() => validateContextEventName('userCreated')).toThrow(
      'Validation failed: Event name must follow the pattern "contextName:EventName".'
    )
  })
})
