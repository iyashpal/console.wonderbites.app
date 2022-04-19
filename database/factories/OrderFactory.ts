import Order from 'App/Models/Order'
import UserFactory from './UserFactory'
import ProductFactory from './ProductFactory'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Order, ({ faker }) => ({
  payment_method: 'Cash',
  ipAddress: faker.internet.ip(),
}))
  .relation('user', () => UserFactory)
  .relation('products', () => ProductFactory)
  .build()
