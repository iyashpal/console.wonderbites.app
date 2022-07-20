import renderHTML from 'mjml'
import View from '@ioc:Adonis/Core/View'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import { User } from 'App/Models'

export default class SendPasswordResetLink extends BaseMailer {
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  constructor (private user: User) {
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
    message
      .subject('Reset Password Notification')
      .from('admin@example.com')
      .to(this.user.email)
      .html(renderHTML(await View.render('emails/send-password-reset-link')).html)
  }
}
