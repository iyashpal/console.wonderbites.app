import Attribute from 'App/Models/Attribute'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Attribute, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(5),
    price: faker.commerce.price(),
    quantity: faker.random.numeric(8),
    status: !!faker.random.numeric(),
  }
}).build()