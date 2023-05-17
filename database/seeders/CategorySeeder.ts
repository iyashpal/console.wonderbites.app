import { Category } from 'App/Models'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class CategorySeederSeeder extends BaseSeeder {
  public async run () {
    await Category.updateOrCreateMany('name', [
      {
        name: 'Appetizers',
        description: '',
        type: 'Product',
      },
      {
        name: 'Asian',
        description: '',
        type: 'Product',
      },
      {
        name: 'Beverages',
        description: '',
        type: 'Product',
      },
      {
        name: 'Desserts',
        description: '',
        type: 'Product',
      },
      {
        name: 'Iftar Combos',
        description: '',
        type: 'Product',
      },
      {
        name: 'Japanese',
        description: '',
        type: 'Product',
      },
      {
        name: 'Pasta',
        description: '',
        type: 'Product',
      },
      {
        name: 'Pinsino',
        description: '',
        type: 'Product',
      },
      {
        name: 'Pizza',
        description: '',
        type: 'Product',
      },
      {
        name: 'Poké Bowls',
        description: '',
        type: 'Product',
      },
    ])
  }
}
