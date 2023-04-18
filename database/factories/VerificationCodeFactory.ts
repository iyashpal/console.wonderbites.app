import {DateTime} from 'luxon'
import {UserFactory} from './index'
import {VerificationCode} from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(VerificationCode, async ({faker}) => {
  return {
    code: faker.datatype.number({min: 10000, max: 99999}).toString(),
    expiresAt: DateTime.now().plus({hour: 1}),
    verifiedAt: DateTime.now().plus({hour: 1}),
  }
})
  .relation('user', () => UserFactory)
  .build()
