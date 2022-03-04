import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CartItems from 'App/Models/CartItem'
export default class CartItemsController {
  public async index ({ response }: HttpContextContract) {
    try {

      // const id = request.input('id');
      const cart = await CartItems.all()
      response.status(200).json(cart)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create ({

  }: HttpContextContract) { }

  public async store () { }

  public async show ({ }: HttpContextContract) {

  }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }


}
