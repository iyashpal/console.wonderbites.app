import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Cart from 'App/Models/Cart'

export default class CartPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, cart: Cart) {}
  public async create (user: User) {}
  public async update (user: User, cart: Cart) {}
  public async delete (user: User, cart: Cart) {}
}
