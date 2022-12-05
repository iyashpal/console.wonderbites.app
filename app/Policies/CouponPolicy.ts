import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Coupon from 'App/Models/Coupon'

export default class CouponPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, coupon: Coupon) {}
  public async create (user: User) {}
  public async update (user: User, coupon: Coupon) {}
  public async delete (user: User, coupon: Coupon) {}
}
