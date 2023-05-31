import { Cuisine } from 'App/Models'
import Drive from '@ioc:Adonis/Core/Drive'
import {CategoryFactory, UserFactory} from '.'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Cuisine, async ({ faker }) => {
  const thumbnail = new Attachment({
    size: 10,
    extname: 'png',
    mimeType: 'image/png',
    name: `${faker.string.alphanumeric(10)}.png`,
  })

  thumbnail.isPersisted = true

  await Drive.put(thumbnail.name, (await file.generatePng('1mb')).contents)

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    thumbnail,
    status: 1,
    deletedAt: null,
  }
})
  .relation('user', () => UserFactory)
  .relation('categories', () => CategoryFactory)
  .state('inactive', (cuisine) => cuisine.status = 0)
  .build()
