import Cart from 'App/Models/Cart'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { CouponFactory, IngredientFactory, ProductFactory, UserFactory } from '.'

export default Factory.define(Cart, ({ faker }) => {
  return {
    userId: null,
    ipAddress: faker.internet.ip(),
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .relation('coupons', () => CouponFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
