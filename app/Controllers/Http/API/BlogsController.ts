// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Blog from 'App/Models/Blog'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class BlogsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const Blogs = await Blog.all()
      response.status(200).json(Blogs)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
  public async show ({ params: { id }, response }) {
    try {
      const blog = await Blog.findOrFail(id)
      response.status(200).json(blog)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }
}