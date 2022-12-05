import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Order from 'App/Models/Order'

export default class OrderPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, order: Order) {}
  public async create (user: User) {}
  public async update (user: User, order: Order) {}
  public async delete (user: User, order: Order) {}
}
