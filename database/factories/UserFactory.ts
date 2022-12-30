import { User } from 'App/Models'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { AddressFactory, CartFactory, OrderFactory, WishlistFactory } from '.'

export default Factory.define(User, async ({ faker }) => {
  // User profile attachment
  const attachment = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1mb')).contents)

  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    mobile: faker.phone.number('+91 ##########'),
    email: faker.internet.email(),
    avatar: attachment,
    password: 'Welcome@123!',
  }
})
  .relation('cart', () => CartFactory)
  .relation('orders', () => OrderFactory)
  .relation('wishlist', () => WishlistFactory)
  .relation('addresses', () => AddressFactory)
  .build()
