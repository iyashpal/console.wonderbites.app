import {uniqueHash} from 'App/Helpers/Core'
import ErrorJSON from 'App/Helpers/ErrorJSON'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/API/Carts/UpdateValidator'
import {Cart, Product, Ingredient, Variant, Category } from 'App/Models'

export default class CartsController {
  /**
   * Get cart of current logged-in/guest user.
   *
   * @param user User
   * @param id number
   * @param token string
   *
   * @returns Cart
   */
  protected async cart (auth: AuthContract, params: Record<string, any>): Promise<Cart> {
    const { id, token } = params as { id: number, token: string }

    const create = (query) => query.create({token: uniqueHash()})

    if (auth.use('api').isLoggedIn) {
      const relatedCart = (auth.use('api').user!).related('cart')

      const query = relatedCart.query().match([
        id && token, query => query.where('id', id).where('token', token),
      ]).first()

      return (await query) ?? await create(relatedCart)
    }

    if (id && token) {
      const query = Cart.query().withScopes(scopes => scopes.asGuest(id, token)).first()

      return (await query) ?? await create(Cart)
    }

    return await create(Cart)
  }

  /**
   * Get the preloaded data based on user request.
   *
   * @param request Http Request
   * @param cart Cart
   * @returns object
   */
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
  public async show ({request, auth, params, response}: HttpContextContract) {
    try {
      const cart = await this.cart(auth, params)

      response.ok(await this.data(request, cart))
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({auth, params, request, response}: HttpContextContract) {
    try {
      let cart = await this.cart(auth, params)

      const payload = await request.validate(UpdateValidator)

      await cart.merge({data: payload.data, userId: payload.user_id, couponId: payload.coupon_id}).save()

      response.ok(await this.data(request, cart))
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
