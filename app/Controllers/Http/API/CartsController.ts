import {uniqueHash} from 'App/Helpers/Core'
import {types} from '@ioc:Adonis/Core/Helpers'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/API/Carts/UpdateValidator'
import {User, Cart, Product, Ingredient, Variant, Category} from 'App/Models'

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
   * @param id number
   * @param token string
   *
   * @returns Cart
   */
  protected async cart (user: User | undefined, id: number, token: string): Promise<Cart> {
    if (types.isNull(user) || types.isUndefined(user)) {
      try {
        console.log({id, token})
        return await Cart.query().withScopes(scopes => scopes.asGuest(id, token)).firstOrFail()
      } catch (error) {
        console.log(error)
        return await Cart.create({token})
      }
    }

    try {
      return await user.related('cart').query().firstOrFail()
    } catch (error) {
      return await user.related('cart').create({token})
    }
  }

  protected async data (request: RequestContract, cart: Cart) {
    const products = () => {
      if (request.input('with', []).includes('products')) {
        return Product.query().whereIn('id', cart.ProductIDs())
      }

      return []
    }

    const variants = () => {
      if (request.input('with', []).includes('variants')) {
        return Variant.query().whereIn('id', cart.VariantIDs())
      }
      return []
    }

    const ingredients = () => {
      if (request.input('with', []).includes('ingredients')) {
        return Ingredient.query().whereIn('id', cart.IngredientIDs())
      }

      return []
    }

    const categories = () => {
      if (request.input('with', []).includes('categories')) {
        return Category.query().whereIn('id', cart.CategoryIDs())
          .orWhereHas('products', query => query.whereIn('products.id', cart.ProductIDs()))
      }

      return []
    }

    return {
      ...cart.toJSON(),
      products: await products(),
      ingredients: await ingredients(),
      variants: await variants(),
      categories: await categories(),
    }
  }

  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({request, auth, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {id, token} = this.cartHeaders(request)

      console.log({id, token})

      const cart = await this.cart(user, id, token)

      response.ok(await this.data(request, cart))
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {id, token} = this.cartHeaders(request)

      let cart = await this.cart(user, id, token)

      const payload = await request.validate(UpdateValidator)

      await cart.merge({data: payload.data, userId: payload.user_id, couponId: payload.coupon_id}).save()

      response.ok(await this.data(request, cart))
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
