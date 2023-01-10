import { ExtraField } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(ExtraField, ({ faker }) => {
  return {
    relation: '',
    field: faker.helpers.slugify(faker.lorem.word()),
    data: faker.helpers.slugify(faker.lorem.word()),
    status: 'show',
  }
}).build()
