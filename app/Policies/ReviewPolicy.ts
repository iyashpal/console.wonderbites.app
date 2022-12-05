import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Review from 'App/Models/Review'

export default class ReviewPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, review: Review) {}
  public async create (user: User) {}
  public async update (user: User, review: Review) {}
  public async delete (user: User, review: Review) {}
}
