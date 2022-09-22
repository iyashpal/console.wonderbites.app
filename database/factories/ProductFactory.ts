import Product from 'App/Models/Product'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { CategoryFactory, IngredientFactory, MediaFactory, ReviewFactory, UserFactory } from '.'

export default Factory.define(Product, ({ faker }) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  sku: faker.datatype.number({ min: 10000, max: 100000 }).toString(),
  calories: faker.datatype.number({ min: 0, max: 1000 }).toString(),
  price: faker.datatype.number({ min: 0, max: 1500 }).toString(),
  status: 1,
}))
  .relation('user', () => UserFactory)
  .relation('media', () => MediaFactory)
  .relation('reviews', () => ReviewFactory)
  .relation('categories', () => CategoryFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
