import UserFactory from './UserFactory'
import Product from 'App/Models/Product'
import Factory from '@ioc:Adonis/Lucid/Factory'
import MediaFactory from './MediaFactory'

export default Factory.define(Product, ({ faker }) => ({
  name: faker.unique.name,
  description: faker.lorem.sentences(6),
  sku: faker.datatype.number({ min: 10000, max: 100000 }).toString(),
  calories: faker.datatype.number({ min: 0, max: 1000 }).toString(),
  price: faker.datatype.number({ min: 0, max: 1500 }).toString(),
  status: 1,
}))
  .relation('user', () => UserFactory)
  .relation('media', () => MediaFactory)
  .build()
