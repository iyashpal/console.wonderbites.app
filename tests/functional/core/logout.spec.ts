import {test} from '@japa/runner'
import Database from "@ioc:Adonis/Lucid/Database";
import {UserFactory} from "Database/factories";

test.group('Core [core.logout]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.post(route('core.logout'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.logout'])

  test('it do not allow access to a non core user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.logout')).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.logout'])

  test('it allows access to a core user', async ({ client, route}) => {
    const user = await UserFactory.with('role').create()

    console.log(user.roleId)

    const response = await client.post(route('core.logout')).guard('api').loginAs(user)
    response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains({revoked: true})
  }).tags(['@core', '@core.logout'])
})
