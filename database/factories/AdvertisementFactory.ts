import Factory from '@ioc:Adonis/Lucid/Factory'
import Advertisement from 'App/Models/Advertisement'
import { AdvertisementOptions } from 'App/Models/Enums/Advertisement'
import { UserFactory } from './index'

export default Factory.define(Advertisement, ({ faker }) => {
  return {
    imagePath: faker.image.imageUrl(),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    options: {} as AdvertisementOptions,
    status: 'active',
  }
})
  .relation('user', () => UserFactory)
  .build()
