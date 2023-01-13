import {test} from '@japa/runner'
import Database from "@ioc:Adonis/Lucid/Database";
import {UserFactory} from "Database/factories";

test.group('Core [core.login]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It can not allow user to login without email', async ({client, route, assert}) => {
    const response = await client.post(route('core.login')).json({email: '', password: 'Welcome@123!'})

    response.assertStatus(422)
    assert.properties(response.body().errors, ['email'])
  }).tags(['@core', '@core.login'])

  test('It can not allow user to login without a password', async ({client, route, assert}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.login')).json({email: user.email})

    response.assertStatus(422)
    assert.properties(response.body().errors, ['password'])
  }).tags(['@core', '@core.login'])


  test('It can not allow non core user to login.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.login')).json({
      email: user.email,
      password: 'Welcome@123!'
    })

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.login'])


  test('It can allow core user to login.', async ({client, route, assert}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.login')).json({
      email: user.email,
      password: 'Welcome@123!'
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['type', 'token'])
  }).tags(['@core', '@core.login'])
})
