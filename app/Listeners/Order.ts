import {OrderStatus} from 'App/Models/Enums/Order'
import OrderApproved from 'App/Mailers/OrderApproved'
import type {EventsList} from '@ioc:Adonis/Core/Event'
// import OrderCancellationReceived from 'App/Mailers/OrderCancellationReceived'
import OrderCancellationConfirmation from 'App/Mailers/OrderCancellationConfirmation'

export default class Order {
  public async update (order: EventsList['Order:Update']) {
    switch (order.status) {
      case OrderStatus.CONFIRMED:
        await new OrderApproved(order).send()
        break
      case OrderStatus.CANCELED:
        // await new OrderCancellationReceived(order)
        await new OrderCancellationConfirmation(order).send()
        break
    }
  }
}
