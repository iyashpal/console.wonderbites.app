import Variant from 'App/Models/Variant'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Variant, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(5),
    price: faker.commerce.price(),
    status: !!faker.random.numeric(1),
  }
}).build()
