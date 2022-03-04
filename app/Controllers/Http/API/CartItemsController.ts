import CartItems from 'App/Models/CartItem'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartItemsController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      // const id = request.input('id');
      const cart = await CartItems.all()
      response.status(200).json(cart)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
