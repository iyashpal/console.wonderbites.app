import Cart from 'App/Models/Cart'
import { UserFactory } from './index'
import { uniqueHash } from 'App/Helpers/Core'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Cart, ({ }) => {
  return {
    user_id: null,
    token: uniqueHash(),
    data: [],
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .build()
