import {DateTime} from 'luxon'
import {UserFactory} from './index'
import {VerificationCode} from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { string } from '@ioc:Adonis/Core/Helpers'

export default Factory.define(VerificationCode, async ({faker}) => {
  return {
    state: 'Generate',
    token: string.generateRandom(32),
    code: faker.number.int({min: 10000, max: 99999}).toString(),
    expiresAt: DateTime.now().plus({hour: 1}),
    verifiedAt: DateTime.now().plus({hour: 1}),
  }
})
  .relation('user', () => UserFactory)
  .build()
