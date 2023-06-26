import Cart from 'App/Models/Cart'
import { uniqueHash } from 'App/Helpers/Core'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { IngredientFactory, ProductFactory, UserFactory } from '.'

export default Factory.define(Cart, ({ faker }) => {
  return {
    user_id: null,
    token: uniqueHash(),
    data: [],
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
