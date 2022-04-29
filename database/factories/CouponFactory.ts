import Factory from '@ioc:Adonis/Lucid/Factory'
import Coupon from 'App/Models/Coupon'
import { DateTime } from 'luxon'

export default Factory.define(Coupon, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    code: faker.internet.userName(),
    discountType: 'Price',
    discountValue: '50',
    started_at: DateTime.now(),
    expired_at: DateTime.now().endOf('month'),
  }
}).build()
