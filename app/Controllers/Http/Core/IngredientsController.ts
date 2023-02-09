import {Ingredient} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Ingredients/StoreValidator'

export default class IngredientsController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const ingredients = await Ingredient.query()
        .whereNull('deleted_at')
        .paginate(request.input('page', 1), request.input('limit', 10))

      response.status(200).json(ingredients)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async store ({auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!
      const {
        name, price, description, quantity, unit, maxQuantity, minQuantity, thumbnail,
      } = await request.validate(StoreValidator)

      const ingredient = await Ingredient.create({
        userId: user.id, name, price, description, quantity, unit, maxQuantity, minQuantity,
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
      })

      response.ok(ingredient)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({response, params}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.query().where('id', params.id).firstOrFail()

      response.json(ingredient)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    try {
      const {
        name, price, description, quantity, unit, maxQuantity, minQuantity, thumbnail,
      } = await request.validate(StoreValidator)

      const ingredient = await Ingredient.findByOrFail('id', params.id)

      await ingredient.merge({
        name: name ?? ingredient.name,
        price: price ?? ingredient.price,
        description: description ?? ingredient.description,
        quantity: quantity ?? ingredient.quantity,
        unit: unit ?? ingredient.unit,
        maxQuantity: maxQuantity ?? ingredient.maxQuantity,
        minQuantity: minQuantity ?? ingredient.minQuantity,
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : ingredient.thumbnail,
      }).save()

      response.ok(ingredient)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({params, response}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.findByOrFail('id', params.id)

      await ingredient.delete()

      response.ok({success: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
