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
    name: `${faker.string.alphanumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1kb')).contents)

  return {
    roleId: null,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: DateTime.fromJSDate(
      faker.date.birthdate({min: 20, max: 40})
    ),
    areaCode: faker.phone.number('+###'),
    mobile: faker.phone.number('##########'),
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
