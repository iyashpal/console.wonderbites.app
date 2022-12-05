import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Media from 'App/Models/Media'

export default class MediaPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, media: Media) {}
  public async create (user: User) {}
  public async update (user: User, media: Media) {}
  public async delete (user: User, media: Media) {}
}
