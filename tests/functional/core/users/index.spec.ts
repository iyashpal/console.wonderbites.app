import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {UserFactory} from 'Database/factories'

test.group('Core [users.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const response = await client.get(route('core.users.index'))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.index'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.users.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.index'])

  test('it reads 200 status code when user is authenticated with valid role.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.users.index')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({data: [{id: user.id, first_name: user.firstName, last_name: user.lastName}]})
  }).tags(['@core', '@core.users.index'])

  test('it can read user role in the response.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.users.index')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [
        {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          role: {
            id: user.roleId,
          },
        },
      ],
    })
  }).tags(['@core', '@core.users.index'])

  test('it can read the page number {$i}.').with([1, 2, 3, 4]).run(async ({client, route}, page) => {
    const users = await UserFactory.with('role').createMany(40)
    const [user] = users
    const response = await client.get(route('core.users.index', {}, {qs: {page, limit: 10}})).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {current_page: page},
      data: users.slice((page - 1) * 10, page * 10).map(({id}) => ({id})),
    })
  }).tags(['@core', '@core.users.index'])
})
