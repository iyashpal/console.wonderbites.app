import renderHTML from 'mjml'
import View from '@ioc:Adonis/Core/View'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'

export default class OneTimePasswordMail extends BaseMailer {
  constructor (public to: string, public code: string) {
    super()
  }

  /**
   * The prepare method is invoked automatically when you run
   * "OneTimePassword.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    message
      .to(this.to)
      .subject('Your One-Time Password for Wonderbites')
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/one-time-password', this)).html)
  }
}
