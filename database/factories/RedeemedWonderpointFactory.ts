import RedeemedWonderpoint from 'App/Models/RedeemedWonderpoint'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'
import CartFactory from './CartFactory'

export default Factory.define(RedeemedWonderpoint, ({ faker }) => {
  return { points: faker.datatype.number({ max: 100 }) }
})
  .relation('user', () => UserFactory)
  .relation('cart', () => CartFactory)
  .build()
