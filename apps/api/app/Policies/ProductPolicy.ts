import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Product from 'App/Models/Product'

export default class ProductPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, product: Product) {}
  public async create (user: User) {}
  public async update (user: User, product: Product) {}
  public async delete (user: User, product: Product) {}
}
