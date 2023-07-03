import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class OTP {
  public async viaSMS (source: string, code: string, identifier: string) {
    try {
      const body = JSON.stringify({
        username: Env.get('SMS_USERNAME'),
        password: Env.get('SMS_PASSWORD'),
        recipients: [source],
        message: code + ' is your OTP for Wonderbites. For any questions, contact us at +355696011010. ' + identifier,
        'dlr-url': Env.get('APP_URL'),
      })

      if ((/(\+355)[0-9]+$/g).test(source)) {
        await fetch('https://mybsms.vodafone.al/ws/send.json', { method: 'POST', body })
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async viaMail (source: string, code: string) {
    if ((/^\S+@\S+\.\S+$/).test(source)) {
      try {
        await Mail.send((message) => {
          message.to(source)
          message.subject('OTP verification for Wonderbites')
          message.from(Env.get('SMTP_FROM_ADDRESS', null), Env.get('SMTP_FROM_NAME', 'Wonderbites'))
          message.html(code + ' is your OTP for Wonderbites. For any questions, contact us at +355696011010.')
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
