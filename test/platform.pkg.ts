import { platform } from '../src/utils/platform'

describe('ddd platform utils', () => {
  it('detects node runtime by process availability', () => {
    expect(platform.isNodeJs(global.process)).toBe(true)
    expect(platform.isNodeJs(undefined)).toBe(false)
  })

  it('detects browser runtime by window availability', () => {
    const fakeWindow = {} as Window

    expect(platform.isBrowser(fakeWindow)).toBe(true)
    expect(platform.isBrowser(undefined)).toBe(false)
  })
})
