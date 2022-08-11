import Order from 'App/Models/Order'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { AddressFactory, CouponFactory, IngredientFactory, ProductFactory, UserFactory } from '.'

export default Factory.define(Order, ({ faker }) => ({
  payment_method: 'COD',
  ipAddress: faker.internet.ip(),
  note: faker.lorem.paragraph(),
  status: 0,
}))
  .relation('user', () => UserFactory)
  .relation('coupon', () => CouponFactory)
  .relation('address', () => AddressFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
