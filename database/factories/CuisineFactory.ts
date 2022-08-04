import { CategoryFactory } from '.'
import { Cuisine } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Cuisine, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    imagePath: faker.image.imageUrl(),
    status: 1,
  }
})
  .relation('categories', () => CategoryFactory)
  .state('inactive', (cuisine) => cuisine.status = 0)
  .build()
