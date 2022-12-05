import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Category from 'App/Models/Category'

export default class CategoryPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, category: Category) {}
  public async create (user: User) {}
  public async update (user: User, category: Category) {}
  public async delete (user: User, category: Category) {}
}
