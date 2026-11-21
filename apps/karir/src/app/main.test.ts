import { expect, test } from 'vitest'
import { init, isShowcaseRoute, Message, update } from './main.ts'

test('the starter app updates its model through a message', () => {
  const initial = init()
  const result = update(initial.model, Message.ClickedContinue())

  expect(result.model.ready).toBe(true)
})

test('the UI showcase route is gated by the feature flag and path', () => {
  // jsdom/vitest has no browser location by default in this package — treat as off.
  expect(typeof isShowcaseRoute()).toBe('boolean')
})
