import Role from 'App/Models/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'
import {UserFactory} from 'Database/factories/index'

export default Factory.define(Role, ({faker}) => {
  return {
    title: faker.name.jobTitle(),
    description: faker.lorem.paragraph(20),
    scope: {},
  }
})
  .relation('users', () => UserFactory)
  .build()
