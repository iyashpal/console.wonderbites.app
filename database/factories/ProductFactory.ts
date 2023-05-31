import {DateTime} from 'luxon'
import Product from 'App/Models/Product'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { CategoryFactory, IngredientFactory, MediaFactory, ReviewFactory, UserFactory } from '.'

export default Factory.define(Product, async ({ faker }) => {
  // User profile attachment
  const attachment = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.string.alphanumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1mb')).contents)

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail: attachment,
    sku: faker.number.int({ min: 10000, max: 100000 }).toString(),
    calories: faker.number.int({ min: 0, max: 1000 }).toString(),
    price: faker.number.int({ min: 0, max: 1500 }),
    publishedAt: DateTime.now(),
    isPopular: faker.datatype.boolean(),
    isCustomizable:faker.datatype.boolean(),
    type: faker.string.alpha(10),
    status: 'published',
  }
})
  .relation('user', () => UserFactory)
  .relation('media', () => MediaFactory)
  .relation('reviews', () => ReviewFactory)
  .relation('categories', () => CategoryFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
