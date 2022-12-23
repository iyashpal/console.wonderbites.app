import { ProductFactory } from '.'
import Media from 'App/Models/Media'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Media, async ({ faker }) => {
  const attachment = new Attachment({
    extname: 'png',
    size: 10 * 1000,
    mimeType: 'image/png',
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  await Drive.put(attachment.name, (await file.generatePng('1mb')).contents)

  return {
    title: faker.lorem.lines(1),
    caption: faker.lorem.lines(2),
    attachment,
  }
})
  .relation('products', () => ProductFactory)
  .build()
