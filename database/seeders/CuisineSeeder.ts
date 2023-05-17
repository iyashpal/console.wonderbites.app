import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Cuisine } from 'App/Models'

export default class extends BaseSeeder {
  public async run () {
    await Cuisine.updateOrCreateMany('name', [
      {
        name: 'Asian',
        description: '',
      },
      {
        name: 'Italian',
        description: '',
      },
      {
        name: 'Japanese',
        description: '',
      },
    ])
  }
}
