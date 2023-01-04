import User from 'App/Models/User'
import Order from 'App/Models/Order'
import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

export default class OrderPolicy extends BasePolicy {
  /**
   * Determine whether the user can view the model list.
   * 
   * @param user User
   * @returns Boolean
   */
  public async viewList (user: User) {
    return Boolean(user)
  }

  /**
   * Determine whether the user can view the model.
   * 
   * @param user User
   * @param order Order
   * @returns Boolean
   */
  @action({ allowGuest: true })
  public async view (user: User, order: Order) {
    if (!user && order.user_id === null) {
      return true
    }

    if (!user && order.user_id !== null) {
      return false
    }

    return user.id === order.user_id
  }

  /**
   * Determine whether the user can create models.
   * 
   * @param user User
   * @returns Boolean
   */
  @action({ allowGuest: true })
  public async create (user: User) {
    return true
  }

  /**
   * Determine whether the user can update the model.
   * 
   * @param user User
   * @param order Order
   * @returns Boolean
   */
  @action({ allowGuest: true })
  public async update (user: User, order: Order) {
    if (!user && order.user_id === null) {
      return true
    }

    if (!user && order.user_id !== null) {
      return false
    }

    return user.id === order.user_id
  }

  /**
   * Determine whether the user can delete the model.
   * 
   * @param user User
   * @param order Order
   * @returns Boolean
   */
  public async delete (user: User, order: Order) {
    return false
  }
}
