/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'

Event.on('User:OnBoard', 'User.onBoard')
Event.on('Order:Created', 'Order.created')
Event.on('Order:Update', 'Order.update')
Event.on('Checkout:Processed', 'Checkout.processed')
Event.on('OneTimePassword:SMS', 'OneTimePassword.sms')
Event.on('OneTimePassword:EMAIL', 'OneTimePassword.email')
