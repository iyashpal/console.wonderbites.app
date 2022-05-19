import Factory from '@ioc:Adonis/Lucid/Factory'
import Media from 'App/Models/Media'

export default Factory.define(Media, ({ faker }) => {
  return {
    title: faker.lorem.lines(1),
    caption: faker.lorem.lines(2),
    filePath: faker.image.unsplash.imageUrl(),
  }
}).build()
