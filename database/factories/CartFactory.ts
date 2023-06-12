import Cart from 'App/Models/Cart'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { IngredientFactory, ProductFactory, UserFactory } from '.'

export default Factory.define(Cart, ({ faker }) => {
  return {
    user_id: null,
    session_id: faker.string.uuid(),
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
