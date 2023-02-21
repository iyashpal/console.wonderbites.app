import {CategoryFactory, UserFactory} from '.'
import { Cuisine } from 'App/Models'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Cuisine, async ({ faker }) => {
  const thumbnail = new Attachment({
    extname: 'png',
    size: 10 * 1000,
    mimeType: 'image/png',
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  thumbnail.isPersisted = true

  await Drive.put(thumbnail.name, (await file.generatePng('1mb')).contents)

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail,
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .relation('categories', () => CategoryFactory)
  .state('inactive', (cuisine) => cuisine.status = 0)
  .build()
