import Wonderpoint from 'App/Models/Wonderpoint'
import Factory from '@ioc:Adonis/Lucid/Factory'
import UserFactory from './UserFactory'

export default Factory.define(Wonderpoint, ({ faker }) => {
  return {
    event: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    points: faker.datatype.number({ max: 100 }),
  }
})
  .relation('user', () => UserFactory)
  .build()
