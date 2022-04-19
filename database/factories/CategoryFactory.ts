import Category from 'App/Models/Category'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Category, ({ faker }) => {
  return {
    name: faker.word.adjective(),
    description: faker.lorem.lines(2),
    type: 'Product',
    parent: 0,
    status: 1,
  }
}).build()
