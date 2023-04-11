import Banner from 'App/Models/Banner'
import Factory from '@ioc:Adonis/Lucid/Factory'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import {file} from '@ioc:Adonis/Core/Helpers'
import {AdvertisementOptions} from 'App/Models/Enums/Advertisement'
import {UserFactory} from 'Database/factories/index'

export default Factory.define(Banner, async ({ faker }) => {
  const attachment = new Attachment({
    extname: 'png',
    size: 10 * 1000,
    mimeType: 'image/png',
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  attachment.isPersisted = true

  await Drive.put(attachment.name, (await file.generatePng('1mb')).contents)

  return {
    attachment,
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    options: {} as AdvertisementOptions,
    status: 'active',
  }
})
  .relation('user', () => UserFactory)
  .build()
