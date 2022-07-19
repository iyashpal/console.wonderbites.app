import Wonderpoint from 'App/Models/Wonderpoint'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'

export default Factory.define(Wonderpoint, ({ faker }) => {
  return {
    action: 'earn',
    event: faker.lorem.sentence(),
    points: faker.datatype.number({ max: 100 }),
    extras: faker.datatype.array(),
  }
})
  .relation('user', () => UserFactory)
  .build()