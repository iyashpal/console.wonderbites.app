import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Wishlist from 'App/Models/Wishlist'

export default class WishlistPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, wishlist: Wishlist) {}
  public async create (user: User) {}
  public async update (user: User, wishlist: Wishlist) {}
  public async delete (user: User, wishlist: Wishlist) {}
}
