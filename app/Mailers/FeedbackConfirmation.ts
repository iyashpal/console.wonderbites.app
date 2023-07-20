import renderHTML from 'mjml'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'

export default class FeedbackConfirmation extends BaseMailer {
  /**
     * The prepare method is invoked automatically when you run
     * "FeedbackConfirmation.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */
  public async prepare (message: MessageContract) {
    message
      .to('user@example.com')
      .subject('Thank You for Your Feedback')
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/feedback-confirmation')).html)
  }
}
