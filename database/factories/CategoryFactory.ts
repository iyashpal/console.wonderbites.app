import Category from 'App/Models/Category'
import Drive from '@ioc:Adonis/Core/Drive'
import {file} from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { CuisineFactory, IngredientFactory, ProductFactory } from '.'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Category, async ({ faker }) => {
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
    name: faker.word.adjective(),
    description: faker.lorem.lines(2),
    thumbnail: attachment,
    type: 'Product',
    parent: null,
    options: null,
    status: 'public',
  }
})
  .relation('products', () => ProductFactory)
  .relation('cuisines', () => CuisineFactory)
  .relation('ingredients', () => IngredientFactory)
  .build()
