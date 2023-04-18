import {User} from 'App/Models'
import {DateTime} from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import {file} from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import {AddressFactory, CartFactory, OrderFactory, WishlistFactory, RoleFactory} from './index'

export default Factory.define(User, async ({faker}) => {
  // User profile attachment
  const attachment = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1kb')).contents)

  return {
    roleId: null,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dateOfBirth: DateTime.fromJSDate(
      faker.date.birthdate({min: 20, max: 40})
    ),
    mobile: faker.phone.number('+91 ##########'),
    email: faker.internet.email(),
    avatar: attachment,
    password: 'Welcome@123!',
  }
})
  .relation('role', () => RoleFactory)
  .relation('cart', () => CartFactory)
  .relation('orders', () => OrderFactory)
  .relation('wishlist', () => WishlistFactory)
  .relation('addresses', () => AddressFactory)
  .relation('verificationCodes', () => RoleFactory)
  .build()
