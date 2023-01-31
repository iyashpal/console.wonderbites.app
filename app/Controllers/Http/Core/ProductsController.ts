import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {Product} from 'App/Models'

export default class ProductsController {
  public async index ({response, request}: HttpContextContract) {
    const {page, limit} = <{ page: number, limit: number }>request.all()

    const products = await Product.query()
      .whereNull('deleted_at')
      .paginate(page ?? 1, limit ?? 10)

    response.json(products)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
