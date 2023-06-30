import {Cuisine} from 'App/Models'
import ErrorJSON from 'App/Helpers/ErrorJSON'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class CategoryCuisineAction {
  public async handle ({request, response, params}: HttpContextContract) {
    try {
      let cuisine = await Cuisine.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      const {action, categories} = request.all() as { action: string, categories: number[] }

      switch (action) {
        case 'attach':
          await cuisine.related('categories').attach(categories)
          break

        case 'detach':
          await cuisine.related('categories').detach(categories)
          break
      }

      await cuisine.load('categories')

      return response.json({cuisine})
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
