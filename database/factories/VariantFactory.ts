import Variant from 'App/Models/Variant'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default Factory.define(Variant, async ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(5),
    thumbnail: new Attachment({
      extname: 'png',
      size: 1024,
      mimeType: 'image/png',
      name: `${faker.string.alpha(10)}.png`,
    }),
    price: faker.commerce.price(),
    status: !!faker.string.numeric(1),
  }
}).build()
