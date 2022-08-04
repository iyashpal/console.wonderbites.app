import Address from 'App/Models/Address'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

export default Factory.define(Address, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.street(),
    city: faker.address.city(),
    phone: faker.phone.number(),
    location: { lat: faker.address.latitude(), lng: faker.address.longitude() },
    type: 'home',
  }
})
  .relation('user', () => UserFactory)
  .state('home', (address) => address.type = 'home')
  .state('office', (address) => address.type = 'office')
  .state('other', (address) => address.type = 'other')
  .state('no_location', (address) => address.location = {})
  .build()
