import renderHTML from 'mjml'
import { User } from 'App/Models'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class UserOnBoard extends BaseMailer {
  constructor (private user: User) {
    super()
  }

  /**
   * The prepare method is invoked automatically when you run
   * "UserOnBoard.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    message
      .to(this.user.email)
      .subject('Welcome to Wonderbites!')
      .from(Env.get('SMTP_FROM_ADDRESS', 'info@wonderbites.app'), Env.get('SMTP_FROM_NAME', 'Wonderbites'))
      .html(renderHTML(await View.render('emails/user-on-board', this)).html)
  }
}
