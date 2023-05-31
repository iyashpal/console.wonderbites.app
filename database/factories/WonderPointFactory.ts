import WonderPoint from 'App/Models/WonderPoint'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

export default Factory.define(WonderPoint, ({ faker }) => {
  return {
    action: 'earn',
    event: faker.lorem.sentence(),
    points: faker.number.int({ max: 100 }),
    extras: [],
  }
})
  .relation('user', () => UserFactory)
  .build()
