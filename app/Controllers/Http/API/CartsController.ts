import { uniqueHash } from 'App/Helpers/Core'
import {types} from '@ioc:Adonis/Core/Helpers'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {User, Cart, Product, Ingredient, Variant} from 'App/Models'
import UpdateValidator from 'App/Validators/API/Carts/UpdateValidator'

export default class CartsController {
  protected cartHeaders (request: RequestContract) {
    return {
      id: request.header('X-Cart-ID', 0) as number,
      token: request.header('X-Cart-Token', uniqueHash()),
    }
  }

  /**
   * Get cart of current logged-in/guest user.
   *
   * @param request RequestContract
   * @param user User
   * @returns Cart
   */
  protected async cart (user: User | undefined, id: number, token: string): Promise<Cart> {
    if (types.isNull(user) || types.isUndefined(user)) {
      try {
        return await Cart.query().withScopes(scopes => scopes.asGuest(id, token)).firstOrFail()
      } catch (error) {
        return await Cart.create({ token })
      }
    }

    try {
      return await user.related('cart').query().firstOrFail()
    } catch (error) {
      return await user.related('cart').create({token})
    }
  }

  protected async data (request: RequestContract, cart: Cart) {
    const products = async () => {
      if (request.input('with', []).includes('products')) {
        return await Product.query().select(request.input('select', ['*'])).whereIn('id', cart.ProductIDs())
      }

      return []
    }

    const variants = async () => {
      if (request.input('with', []).includes('variants')) {
        return await Variant.query().whereIn('id', cart.VariantIDs())
      }
      return []
    }

    const ingredients = async () => {
      if (request.input('with', []).includes('ingredients')) {
        return await Ingredient.query().whereIn('id', cart.IngredientIDs())
      }

      return []
    }

    return {
      products: await products(),
      ingredients: await ingredients(),
      variants: await variants(),
    }
  }

  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {id, token} = this.cartHeaders(request)

      const cart = await this.cart(user, id, token)

      const data = await this.data(request, cart)

      response.ok({
        ...cart.toJSON(),
        ...(data.products.length ? { products: data.products } : {}),
        ...(data.variants.length ? { variants: data.variants } : {}),
        ...(data.ingredients.length ? { ingredients: data.ingredients } : {}),
      })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {id, token} = this.cartHeaders(request)

      let cart = await this.cart(user, id, token)

      const payload = await request.validate(UpdateValidator)

      await cart.merge({ data: payload.data, userId: payload.user_id, couponId: payload.coupon_id }).save()

      const data = await this.data(request, cart)

      response.ok({
        ...cart.toJSON(),
        ...(data.products.length ? { products: data.products } : {}),
        ...(data.variants.length ? { variants: data.variants } : {}),
        ...(data.ingredients.length ? { ingredients: data.ingredients } : {}),
      })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
