import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import ExtraField from 'App/Models/ExtraField'

export default class ExtraFieldPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, extraField: ExtraField) {}
  public async create (user: User) {}
  public async update (user: User, extraField: ExtraField) {}
  public async delete (user: User, extraField: ExtraField) {}
}
