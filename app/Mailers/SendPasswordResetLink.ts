import renderHTML from 'mjml'
import Route from '@ioc:Adonis/Core/Route'
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

  private html

  private resetURL

  constructor (private user: User) {
    super()

    this.resetURL = Route.makeSignedUrl('verifyEmail', { email: user.email }, { expiresIn: '60m' })
  }

  /**
   * The prepare method is invoked automatically when you run
   * "SendPasswordResetLink.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    this.html = await View.render('emails/send-password-reset-link', { url: this.resetURL })

    message
      .subject('Reset Password Notification')
      .from('admin@example.com')
      .to(this.user.email)
      .html(renderHTML(this.html).html)
  }
}
