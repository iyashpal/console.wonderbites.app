import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Wonderpoint from 'App/Models/Wonderpoint'

export default class WonderpointPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, wonderpoint: Wonderpoint) {}
  public async create (user: User) {}
  public async update (user: User, wonderpoint: Wonderpoint) {}
  public async delete (user: User, wonderpoint: Wonderpoint) {}
}
