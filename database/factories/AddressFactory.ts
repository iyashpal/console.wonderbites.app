import Address from 'App/Models/Address'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

export default Factory.define(Address, ({ faker }) => {
  return {
    title: faker.name.jobTitle(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.street(),
    city: faker.address.city(),
    phone: faker.phone.number('+## ##### #####'),
    email: faker.internet.email(),
    location: { lat: faker.address.latitude(), lng: faker.address.longitude() },
    type: 'home',
  }
})
  .relation('user', () => UserFactory)
  .state('home', (address) => address.type = 'home')
  .state('other', (address) => address.type = 'other')
  .state('office', (address) => address.type = 'office')
  .state('no_location', (address) => address.location = {})
  .build()
