import Cart from 'App/Models/Cart'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Cart, ({ faker }) => {
  return {
    userId: null,
    ipAddress: faker.internet.ip(),
  }
}).build()
