import Order from 'App/Models/Order'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { ProductFactory, UserFactory } from '.'

export default Factory.define(Order, ({ faker }) => ({
  payment_method: 'Cash',
  ipAddress: faker.internet.ip(),
}))
  .relation('user', () => UserFactory)
  .relation('products', () => ProductFactory)
  .build()
