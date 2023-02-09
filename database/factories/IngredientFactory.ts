import { UserFactory } from '.'
import { Ingredient } from 'App/Models'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Ingredient, async ({ faker }) => {
  // User profile attachment
  const thumbnail = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  thumbnail.isPersisted = true

  await Drive.put(thumbnail.name, (await file.generatePng('1mb')).contents)

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail,
    unit: 'gr',
    quantity: 5,
    minQuantity: 1,
    maxQuantity: 5,
    status: 1,
  }
})
  .relation('user', () => UserFactory)
  .state('inactive', (ingredient) => ingredient.status = 0)
  .build()
