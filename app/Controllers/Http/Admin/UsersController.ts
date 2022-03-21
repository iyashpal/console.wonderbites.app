import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateValidator from 'App/Validators/User/CreateValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'
import { DateTime } from 'luxon'

export default class UsersController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let users = await User.query().paginate(request.input('page', 1), 2)

    users.baseUrl(request.url())

    return view.render('admin/users/index', { users })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract 
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/users/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await User.create({ ...data, image_path: data.image_path!.fileName }).then((user) => {
      session.flash('user_created', user.id)

      response.redirect().toRoute('users.show', { id: user.id })
    })
  }
  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const user = await User.findOrFail(id)

    return view.render('admin/users/show', { user })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return view.render('admin/users/edit', { user })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await user.merge({
      ...data, image_path: data.image_path ? data.image_path.fileName : user.image_path,
    }).save().then(user => {
      session.flash('user_updated', true)

      response.redirect().toRoute('users.show', { id: user.id })
    })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id, forceDelete }, response, session }: HttpContextContract) {
    const user = await User.findOrFail(id)

    if (forceDelete) {
      await user.delete().then(() => {
        session.flash('user_deleted', true)
        response.redirect().toRoute('users.index')
      })
      return
    }

    await user.merge({ deletedAt: DateTime.local() }).save().then(() => {
      session.flash('user_deleted', true)

      response.redirect().toRoute('users.index')
    })
  }
}
