import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Advertisement from 'App/Models/Advertisement'

export default class AdvertisementPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, advertisement: Advertisement) {}
  public async create (user: User) {}
  public async update (user: User, advertisement: Advertisement) {}
  public async delete (user: User, advertisement: Advertisement) {}
}
