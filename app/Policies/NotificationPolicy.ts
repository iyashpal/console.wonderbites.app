import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Notification from 'App/Models/Notification'

export default class NotificationPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, notification: Notification) {}
  public async create (user: User) {}
  public async update (user: User, notification: Notification) {}
  public async delete (user: User, notification: Notification) {}
}
