import { expect, test } from 'vitest'
import worker from './worker.ts'

const request = new Request('https://nata.test/api/karir/rpc', {
  method: 'POST',
  body: '{"method":"ping"}',
})

test('the website Worker forwards API requests through the service binding', async () => {
  const forwarded: Array<Request> = []

  const response = await worker.fetch(request, {
    API: {
      fetch(input) {
        forwarded.push(input)
        return Promise.resolve(new Response('from the API Worker', { status: 202 }))
      },
    },
  })

  expect(forwarded).toHaveLength(1)
  expect(forwarded[0]?.url).toBe('https://nata.test/api/karir/rpc')
  expect(response.status).toBe(202)
  expect(await response.text()).toBe('from the API Worker')
})
