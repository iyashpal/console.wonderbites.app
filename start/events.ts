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

Event.on('OneTimePassword:SMS', 'OneTimePassword.sms')
Event.on('OneTimePassword:EMAIL', 'OneTimePassword.email')
Event.on('User:OnBoard', 'User.onBoard')
Event.on('Checkout:OrderCreated', 'Checkout.orderCreated')
