import CategoryBlog from 'App/Models/CategoryBlog'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/CategoryBlog/CreateValidator'
import UpdateValidator from 'App/Validators/CategoryBlog/UpdateValidator'
export default class CategoryBlogsController {
/**
     * Display a listing of the resource.
     * 
     * @param param0 HttpContextContract
     * @returns ViewRendererContract
     */
  public async index ({ view, request }: HttpContextContract) {
    let categoryblog = await CategoryBlog.query().paginate(request.input('page', 1), 2)
    categoryblog.baseUrl(request.url())
    return view.render('app/categoryblog/index', { categoryblog })
  }
  /**
     * Show the form for creating a new resource.
     * 
     * @param param0 HttpContextContract 
     * @returns ViewRendererContract
     */
  public async create ({ view }: HttpContextContract) {
    const categoryblog = await CategoryBlog.query().where('status', 1)
    return view.render('app/categoryblog/create', {categoryblog})
  }
  /**
     * Store a newly created resource in storage.
     * 
     * @param param0 HttpContextContract 
     */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    const categoryblog = await CategoryBlog.create(data)
      .then((categoryblog) => {
        session.flash('category_created', categoryblog.id)
        return categoryblog
      })
    response.redirect().toRoute('categoryblog.show', { id: categoryblog.id })
  }
  /**
     * Display the specified resource.
     * 
     * @param param0 {HttpContextContract} 
     * @returns ViewRendererContract
     */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const categoryblog = await CategoryBlog.findOrFail(id)
    return view.render('app/categoryblog/show', { categoryblog })
  }

  /**
     * Show the form for editing the specified resource.
     * 
     * @param param0 HttpContextContract 
     * @returns ViewRendererContract
     */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const categoryblog = await CategoryBlog.findOrFail(id)
    return view.render('app/categoryblog/edit', { categoryblog})
  }

  /**
     * Update the specified resource in storage.
     * 
     * @param param0 HttpContextContract
     */

  public async update ({ request, response, params, session }: HttpContextContract) {
    const categoryblog = await CategoryBlog.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)
    await categoryblog.merge(data)
      .save().then(() => session.flash('category_updated', true))
    response.redirect().toRoute('categoryblog.show', { id: categoryblog.id })
  }
  /**
     * Remove the specified resource from storage.
     * 
     * @param param0 HttpContextContract
     */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const categoryblog = await CategoryBlog.findOrFail(params.id)
    await categoryblog.delete().then(() => {
      session.flash('category_deleted', true)
      response.redirect().toRoute('categoryblog.index')
    })
  }
}