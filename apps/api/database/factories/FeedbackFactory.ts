import { UserFactory } from '.'
import { Feedback } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Feedback, ({ faker }) => {
  return {
    experience: faker.word.verb(1),
    body: faker.lorem.paragraph(10),
    source: faker.random.word(),
  }
})
  .relation('user', () => UserFactory)
  .build()
