import { User } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { AddressFactory, CartFactory, OrderFactory, WishlistFactory, NotificationFactory } from '.'

export default Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    imagePath: faker.image.imageUrl(),
    mobile: faker.phone.number('+91 ##########'),
    email: faker.internet.email(),
    password: 'Welcome@123!',
  }
})
  .relation('cart', () => CartFactory)
  .relation('orders', () => OrderFactory)
  .relation('wishlist', () => WishlistFactory)
  .relation('addresses', () => AddressFactory)
  .relation('notifications', () => NotificationFactory)
  .build()
