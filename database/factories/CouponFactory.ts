import { CartFactory } from '.'
import { DateTime } from 'luxon'
import Coupon from 'App/Models/Coupon'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Coupon, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    code: faker.internet.userName(),
    discountType: 'price',
    discountValue: '50',
    started_at: DateTime.now(),
    expired_at: DateTime.now().endOf('month'),
  }
})
  .relation('carts', () => CartFactory)
  .build()
