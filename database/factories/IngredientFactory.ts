import { UserFactory } from '.'
import { Ingredient } from 'App/Models'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Ingredient, async ({ faker }) => {
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
    price: faker.commerce.price(),
    thumbnail: attachment,
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .state('inactive', (ingredient) => ingredient.status = 0)
  .build()
