import { UserFactory } from '.'
import { Ingredient } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Ingredient, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    imagePath: faker.image.imageUrl(),
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .state('inactive', (ingredient) => ingredient.status = 0)
  .build()
