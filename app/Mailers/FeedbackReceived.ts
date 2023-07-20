import renderHTML from 'mjml'
import View from '@ioc:Adonis/Core/View'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'

export default class FeedbackReceived extends BaseMailer {
  /**
   * The prepare method is invoked automatically when you run
   * "FeedbackReceived.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    message
      .to('user@example.com')
      .subject('Feedback Form Submission Notification')
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/feedback-received')).html)
  }
}
