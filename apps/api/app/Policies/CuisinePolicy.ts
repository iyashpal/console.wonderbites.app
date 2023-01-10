import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Cuisine from 'App/Models/Cuisine'

export default class CuisinePolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, cuisine: Cuisine) {}
  public async create (user: User) {}
  public async update (user: User, cuisine: Cuisine) {}
  public async delete (user: User, cuisine: Cuisine) {}
}
