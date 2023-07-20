import renderHTML from 'mjml'
import {User} from 'App/Models'
import View from '@ioc:Adonis/Core/View'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'

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
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/user-on-board', this)).html)
  }
}