import {Product} from 'App/Models'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class IngredientProductAction {
  public async handle ({request, response, params}: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      switch (request.input('action', 'attach')) {
        case 'detach':
          await product.related('ingredients').detach(request.input('detachable', []))
          break

        default:
          await product.related('ingredients').sync({
            [request.input('id')]: {...request.input('pivot', {})},
          }, false)
          break
      }

      response.ok({success: true})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
