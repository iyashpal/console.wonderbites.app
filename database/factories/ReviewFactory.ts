import { Review } from 'App/Models'
import { ProductFactory, UserFactory } from '.'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Review, ({ faker }) => {
  return {
    userId: 0,
    typeId: 0,
    type: 'Product',
    rating: 5,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(6),
    status: 0,
  }
})
  .relation('user', () => UserFactory)
  .relation('product', () => ProductFactory)
  .state('typeProduct', review => review.type = 'Product')
  .build()
