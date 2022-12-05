import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Ingredient from 'App/Models/Ingredient'

export default class IngredientPolicy extends BasePolicy {
  public async viewList (user: User) {}
  public async view (user: User, ingredient: Ingredient) {}
  public async create (user: User) {}
  public async update (user: User, ingredient: Ingredient) {}
  public async delete (user: User, ingredient: Ingredient) {}
}
