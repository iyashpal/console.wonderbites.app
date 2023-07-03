import User from 'App/Models/User'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

export default class UserPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (currentUser: User, user: User) {}
  public async create (user: User) {}
  public async update (currentUser: User, user: User) {}
  public async delete (currentUser: User, user: User) {
    return currentUser.id === user.id
  }
}
