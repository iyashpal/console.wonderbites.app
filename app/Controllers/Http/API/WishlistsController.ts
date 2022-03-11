import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductWishlist from 'App/Models/ProductWishlist'
//import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Wishlist from 'App/Models/Wishlist'
export default class WishlistsController {
  public async index ({ response }: HttpContextContract) {
    try {
      const wishlists = await Wishlist.all()
      response.status(200).json(wishlists)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
  public async store ({ auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      if(user.id){
        try {
          const wishlistdata = { user_id : user.id, ip_address : request.input('ip_address') }
          const wishlist = await Wishlist.create(wishlistdata)
          if(request.input('product_id')){
            const productids = request.input('product_id')
            for(let i in productids) {
              await ProductWishlist.create({product_id: productids[i] , wishlist_id : wishlist.id })
            }
          }

          response.status(200).json(wishlist)
        } catch (error) {
          response.badRequest(error.message)
        }
      }
    } catch (error){
      response.unauthorized({ message: 'Unauthenticated' })
    }
  }

  public async getwishlist ({ auth,response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      if(user.id){
        try{
          const wishlist = await Wishlist.query() .where('user_id', user.id)
          response.status(200).json(wishlist)
        } catch (error){
          response.badRequest(error.message)
        }
      }
    } catch (error) {
      response.unauthorized({ message: 'Unauthenticated' })
    }
  }
}
