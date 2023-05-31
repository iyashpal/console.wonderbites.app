import Address from 'App/Models/Address'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

export default Factory.define(Address, ({ faker }) => {
  return {
    title: faker.person.jobTitle(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    street: faker.location.street(),
    city: faker.location.city(),
    phone: faker.phone.number('+## ##### #####'),
    email: faker.internet.email(),
    location: { lat: faker.location.latitude().toString(), lng: faker.location.longitude().toString() },
    type: 'home',
  }
})
  .relation('user', () => UserFactory)
  .state('home', (address) => address.type = 'home')
  .state('other', (address) => address.type = 'other')
  .state('office', (address) => address.type = 'office')
  .state('no_location', (address) => address.location = {})
  .build()
