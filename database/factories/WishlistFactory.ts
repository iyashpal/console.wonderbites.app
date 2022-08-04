import Wishlist from 'App/Models/Wishlist'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

export default Factory.define(Wishlist, ({ faker }) => {
  return {
    ipAddress: faker.internet.ip(),
  }
})
  .relation('user', () => UserFactory)
  .build()
