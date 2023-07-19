import renderHTML from 'mjml'
import {User} from 'App/Models'
import View from '@ioc:Adonis/Core/View'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'
import DatabaseTokenRepository from 'App/Services/Auth/Passwords/DatabaseTokenRepository'

export default class SendPasswordResetLink extends BaseMailer {
  constructor (public user: User, public token: string = '') {
    super()
  }

  /**
   * The prepare method is invoked automatically when you run
   * "SendPasswordResetLink.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    this.token = await (new DatabaseTokenRepository()).create(this.user)

    message
      .to(this.user.email)
      .subject('Reset Password Notification')
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/send-password-reset-link', this)).html)
  }
}
