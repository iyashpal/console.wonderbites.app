import Banner from 'App/Models/Banner'
import Drive from '@ioc:Adonis/Core/Drive'
import {file} from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import {UserFactory} from 'Database/factories/index'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'

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
    options: {
      page: faker.lorem.words(1),
      section: faker.lorem.words(1),
      type: faker.lorem.words(1),
      link: faker.lorem.words(1),
    },
    status: 'active',
  }
})
  .relation('user', () => UserFactory)
  .build()
