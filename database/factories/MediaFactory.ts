import { ProductFactory } from '.'
import Media from 'App/Models/Media'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Media, ({ faker }) => {
  return {
    title: faker.lorem.lines(1),
    caption: faker.lorem.lines(2),
    filePath: faker.image.unsplash.imageUrl(),
  }
})
  .relation('products', () => ProductFactory)
  .build()
