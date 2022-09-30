import Wishlist from 'App/Models/Wishlist'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { IngredientFactory, ProductFactory, UserFactory } from '.'

export default Factory.define(Wishlist, ({ faker }) => {
  return {
    ipAddress: faker.internet.ip(),
  }
})
  .relation('user', () => UserFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
