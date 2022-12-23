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
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1mb')).contents)

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail: attachment,
    sku: faker.datatype.number({ min: 10000, max: 100000 }).toString(),
    calories: faker.datatype.number({ min: 0, max: 1000 }).toString(),
    price: faker.datatype.number({ min: 0, max: 1500 }).toString(),
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .relation('media', () => MediaFactory)
  .relation('reviews', () => ReviewFactory)
  .relation('categories', () => CategoryFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
