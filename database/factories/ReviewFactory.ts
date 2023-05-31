import { Review } from 'App/Models'
import { ProductFactory, UserFactory } from '.'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Review, ({ faker }) => {
  return {
    reviewable: 'Product',
    rating: faker.number.int({min: 1, max: 5}),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(6),
    status: 0,
  }
})
  .relation('user', () => UserFactory)
  .relation('product', () => ProductFactory)
  .state('typeProduct', review => review.reviewable = 'Product')
  .build()
