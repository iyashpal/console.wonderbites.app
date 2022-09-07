import { DateTime } from 'luxon'
import Order from 'App/Models/Order'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { AddressFactory, CouponFactory, IngredientFactory, ProductFactory, ReviewFactory, UserFactory } from '.'

export default Factory.define(Order, ({ faker }) => ({
  userId: 0,
  addressId: 0,
  payment_method: 'COD',
  ipAddress: faker.internet.ip(),
  note: faker.lorem.paragraph(),
  status: 0,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
}))
  .relation('user', () => UserFactory)
  .relation('coupon', () => CouponFactory)
  .relation('reviews', () => ReviewFactory)
  .relation('address', () => AddressFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
