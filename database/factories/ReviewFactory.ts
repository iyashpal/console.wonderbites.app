import {User, Review} from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Review, ({faker}) => {
  return {
    userId: 0,
    reviewableId: 0,
    reviewableType: 'Product',
    rating: 5,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(6),
  }
})
  .relation('user', () => User)
  .state('typeProduct', review => review.reviewableType = 'Product')
  .state('typeOrder', review => review.reviewableType = 'Order')
  .build()
