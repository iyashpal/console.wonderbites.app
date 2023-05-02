import User from 'App/Models/User'
import Address from 'App/Models/Address'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

export default class AddressPolicy extends BasePolicy {
  /**
   * Determine whether the user can view the model list.
   *
   * @param user User
   * @returns Boolean
   */
  public async viewList (user: User) {
    return true
  }

  /**
   * Determine whether the user can view the model.
   *
   * @param user User
   * @param address Address
   * @returns Boolean
   */
  public async view (user: User, address: Address) {
    return user.id === address.userId
  }

  /**
   * Determine whether the user can create schema.
   *
   * @param user User
   * @returns Boolean
   */
  public async create (user: User) {
    return true
  }

  /**
   * Determine whether the user can update the model.
   *
   * @param user User
   * @param address Address
   * @returns Boolean
   */
  public async update (user: User, address: Address) {
    return user.id === address.userId
  }

  /**
   * Determine whether the user can delete the model.
   *
   * @param user User
   * @param address Address
   * @returns Boolean
   */
  public async delete (user: User, address: Address) {
    return user.id === address.userId
  }
}
