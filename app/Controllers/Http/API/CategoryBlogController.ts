// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CategoryBlog from 'App/Models/CategoryBlog'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class CategoryBlogController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const categories = await CategoryBlog.all()
      response.status(200).json(categories)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
  public async show ({ params: { id }, response }) {
    try {
      const category = await CategoryBlog.findOrFail(id)
      response.status(200).json(category)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }
}