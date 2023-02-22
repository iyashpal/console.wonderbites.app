import {Role} from 'App/Models'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  public async run () {
    await Role.updateOrCreateMany('title', [
      {
        title: 'Admin',
        description: 'An admin will have all of the permissions.',
        scope: {},
      },
    ])
  }
}
