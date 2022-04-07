import Cart from 'App/Models/Cart'
import { isNull } from '@poppinss/utils/build/src/Helpers/types'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartsController {
  public async show ({ request, auth, response }: HttpContextContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await auth.use('api').authenticate()
    }

    const cart = await this.getCart({ request, user: auth.use('api').user! })

    await cart.load('products')
    await cart.load('ingridients')

    response.json(cart)
  }

  public async update ({ auth, request, response }: HttpContextContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await auth.use('api').authenticate()
    }

    const cart = await this.getCart({ request, user: auth.use('api').user! })

    // Adding products to cart will go here.

    await cart.load('products')
    await cart.load('ingridients')

    response.json(cart)
  }

  protected async getCart ({ request, user }): Promise<Cart> {
    if ([null, undefined].includes(user)) {
      const guestCart = await Cart.query().whereNull('user_id').where('ip_address', request.ip()).first()

      if (isNull(guestCart)) {
        return await Cart.create({ ipAddress: request.ip() })
      }

      return guestCart
    }

    await user.load('cart')

    if (isNull(user.cart)) {
      return await user.related('cart').create({ ip_address: request.ip() })
    }

    return user.cart
  }
}
