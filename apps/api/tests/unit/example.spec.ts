import { test } from '@japa/runner'

test.group('Example', () => {
  test('Say Hello To World', async ({ assert }) => {
    assert.isTrue((2 + 2) === 4)
  })
})
