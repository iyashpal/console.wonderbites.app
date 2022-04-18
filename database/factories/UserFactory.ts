import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    mobile: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    password: 'Welcome@123!',
  }
}).build()
