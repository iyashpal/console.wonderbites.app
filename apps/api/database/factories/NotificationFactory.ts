import { Notification } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Notification, ({ faker }) => {
  return {
    type: 'Product',
    notifiable_type: 'User',
    notifiable_id: 0,
    data: JSON.parse('{}'),
    readAt: null,
  }
}).build()
