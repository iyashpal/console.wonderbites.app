import { Address, Cart, User } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/Checkouts/ProcessValidator'

export default class CheckoutsController {
  protected user: User

  protected cart: Cart

  protected address: Address

  protected response: object = {}

  public async process ({ auth, response, request }: HttpContextContract) {
    this.user = await auth.use('api').authenticate()

    try {
      const attrs = await request.validate(ProcessValidator)

      await this.syncCart(attrs.cart)

      await this.syncAddress(attrs.address)

      try {
        switch (attrs.payment_method) {
          case 'COD':
            this.cashOnDelivery()
            break
        }

        response.json(this.response)
      } catch (error) {
        response.badRequest({ message: 'Something went wrong' })
      }
    } catch (error) {
      response.unprocessableEntity(error)
    }
  }

  protected async syncCart (id: number) {
    this.cart = await Cart.query()
      .where('id', id).where('user_id', this.user.id)
      .preload('ingredients').preload('products').preload('coupons').firstOrFail()
  }

  protected async syncAddress (id) {
    this.address = await Address.query()
      .where('id', id).where('user_id', this.user.id)
      .firstOrFail()
  }

  protected cashOnDelivery () {
    return {}
  }
}
