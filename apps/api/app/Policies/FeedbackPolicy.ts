import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Feedback from 'App/Models/Feedback'

export default class FeedbackPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, feedback: Feedback) {}
  public async create (user: User) {}
  public async update (user: User, feedback: Feedback) {}
  public async delete (user: User, feedback: Feedback) {}
}
