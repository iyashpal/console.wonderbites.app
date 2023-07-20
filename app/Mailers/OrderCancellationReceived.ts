import renderHTML from 'mjml'
import {Order} from 'App/Models'
import Config from '@ioc:Adonis/Core/Config'
import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'

export default class OrderCancellationReceived extends BaseMailer {
  constructor (public order: Order) {
    super()
  }
  /**
   * The prepare method is invoked automatically when you run
   * "OrderCancellationReceived.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare (message: MessageContract) {
    message
      .to(this.order.email)
      .subject('Order Cancellation Alert')
      .from(Config.get('mail.from.email'), Config.get('mail.from.name'))
      .html(renderHTML(await View.render('emails/order-cancellation-received', this)).html)
  }
}
