import { DateTime } from 'luxon'
import Order from 'App/Models/Order'
import { uniqueHash } from 'App/Helpers/Core'
import Factory from '@ioc:Adonis/Lucid/Factory'
import {OrderStatus} from 'App/Models/Enums/Order'
import { CouponFactory, ReviewFactory, UserFactory } from './index'

export default Factory.define(Order, ({ faker }) => ({
  userId: 0,
  orderType: 'delivery',
  token: uniqueHash(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  paymentMode: 'COD',
  note: faker.lorem.paragraph(),
  options: {},
  status: OrderStatus.PLACED,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
}))
  .relation('user', () => UserFactory)
  .relation('coupon', () => CouponFactory)
  .relation('review', () => ReviewFactory)
  .build()
