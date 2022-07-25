import { test } from '@japa/runner'
import DatabaseTokenRepository from 'App/Auth/Passwords/DatabaseTokenRepository'
import { DateTime } from 'luxon'

test.group('Example', () => {
  test('testing of abc', async () => {
    console.log((new DatabaseTokenRepository()).createNewToken())
    console.log(DateTime.now().toISO())
  })
})
