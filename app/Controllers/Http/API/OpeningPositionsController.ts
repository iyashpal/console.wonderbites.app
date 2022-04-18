import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Category from 'App/Models/Category'
import OpeningPosition from 'App/Models/OpeningPosition'
export default class OpeningPositionsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ response}: HttpContextContract) {
    let openingpositions = await OpeningPosition.all()
    //await openingpositions.load('categories')
    response.json(openingpositions)
  }

  /*public async show ({ view, params: { id } }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(id)
    await openingposition.load('categories')
    //openingposition.load('career_categories', (query) => query.select('id'))
    const categories = await Category.query().where('type', 'job')
    return view.render('admin/openingpositions/show', {openingposition,categories})
  }*/
}
