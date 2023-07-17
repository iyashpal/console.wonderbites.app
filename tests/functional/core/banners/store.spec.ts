import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

test.group('Core [banners.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const response = await client.post(route('core.banners.store'))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.store'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.post(route('core.banners.store')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.store'])

  test('it reads 422 status code when user is authenticated with valid role and payload is empty.')
    .run(async ({client, route}) => {
      const user = await UserFactory.with('role').create()
      const response = await client.post(route('core.banners.store')).guard('api').loginAs(user)

      response.assertStatus(422)
    }).tags(['@core', '@core.banners', '@core.banners.store'])

  test('it reads {code} status code when {situation}')
    .with([
      {
        situation: 'title is empty',
        field: 'title',
        value: '',
        code: 422,
        assert: {
          errors: {
            title: 'required validation failed',
          },
        },
      },
      {
        situation: 'status is empty',
        field: 'status',
        value: '',
        code: 422,
        assert: {
          errors: {
            status: 'required validation failed',
          },
        },
      },
      {
        situation: 'attachment is empty',
        field: 'attachment',
        value: '',
        code: 422,
        assert: {
          errors: {
            attachment: 'required validation failed',
          },
        },
      },
      {
        situation: 'option page is empty',
        field: 'page',
        value: '',
        code: 422,
        assert: {
          errors: {
            page: 'required validation failed',
          },
        },
      },
      {
        situation: 'option section is empty',
        field: 'section',
        value: '',
        code: 422,
        assert: {
          errors: {
            section: 'required validation failed',
          },
        },
      },
      {
        situation: 'option type is empty',
        field: 'type',
        value: '',
        code: 422,
        assert: {
          errors: {
            type: 'required validation failed',
          },
        },
      },
      {
        situation: 'option link is empty',
        field: 'link',
        value: '',
        code: 200,
        assert: {},
      },
      {
        situation: 'when we send all details correctly.',
        field: '',
        value: '',
        code: 200,
        assert: {},
      },
    ])
    .run(async ({client, route}, field) => {
      const user = await UserFactory.with('role').create()
      const response = await client.post(route('core.banners.store')).guard('api').loginAs(user)
        .file('attachment', field.field === 'attachment' ? field.value : Application.publicPath('/images/logo.svg'))
        .fields({
          title: 'Today\'s pick',
          status: 'active',
          page: 'home',
          section: 'todayspick',
          type: 'slide',
          link: '',
          ...((field.field !== 'attachment' && field.field) && {[field.field]: field.value}),
        })

      response.assertStatus(field.code)
      if (field.assert) {
        response.assertBodyContains(field.assert)
      }
    }).tags(['@core', '@core.banners', '@core.banners.store'])
})
