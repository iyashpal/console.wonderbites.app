import { DateTime } from 'luxon'
import Order from 'App/Models/Order'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { CouponFactory, IngredientFactory, ProductFactory, ReviewFactory, UserFactory } from '.'

export default Factory.define(Order, ({ faker }) => ({
  userId: 0,
  orderType: 'delivery',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  street: faker.address.streetAddress(),
  city: faker.address.cityName(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  paymentMode: 'COD',
  ipAddress: faker.internet.ip(),
  note: faker.lorem.paragraph(),
  options: {},
  status: 0,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
}))
  .relation('user', () => UserFactory)
  .relation('coupon', () => CouponFactory)
  .relation('review', () => ReviewFactory)
  .relation('products', () => ProductFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
