import User from 'App/Models/User'
import Wishlist from 'App/Models/Wishlist'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Wishlist, ({ faker }) => {
  return {
    ipAddress: faker.internet.ip(),
  }
})
  .relation('user', () => User)
  .build()
