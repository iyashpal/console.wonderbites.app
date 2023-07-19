import Env from '@ioc:Adonis/Core/Env'
import type {EventsList} from '@ioc:Adonis/Core/Event'
import OneTimePasswordMail from 'App/Mailers/OneTimePasswordMail'

export default class OneTimePassword {
  public async sms ({code, identifier, source}: EventsList['OneTimePassword:SMS']) {
    try {
      const body = JSON.stringify({
        username: Env.get('SMS_USERNAME'),
        password: Env.get('SMS_PASSWORD'),
        recipients: [source],
        message: code + ' is your OTP for Wonderbites. For any questions, contact us at +355696011010. ' + identifier,
        'dlr-url': Env.get('APP_URL'),
      })

      if ((/(\+355)[0-9]+$/g).test(source)) {
        await fetch('https://mybsms.vodafone.al/ws/send.json', {method: 'POST', body})
      }
    } catch (error) {
      throw error
    }
  }

  public async email ({source, code}: EventsList['OneTimePassword:EMAIL']) {
    if ((/^\S+@\S+\.\S+$/).test(source)) {
      try {
        await new OneTimePasswordMail(source, code).send()
      } catch (error) {
        throw error
      }
    }
  }
}
