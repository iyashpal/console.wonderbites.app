import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { AddressFactory, CartFactory, OrderFactory } from '.'

export default Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    mobile: faker.phone.number('+91 ##########'),
    email: faker.internet.email(),
    password: 'Welcome@123!',
  }
})
  .relation('cart', () => CartFactory)
  .relation('orders', () => OrderFactory)
  .relation('addresses', () => AddressFactory)
  .build()
