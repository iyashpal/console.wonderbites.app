import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import CreateValidator from 'App/Validators/User/CreateValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let users = await User.query().paginate(request.input('page', 1), 10)

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
    const payload = await request.validate(CreateValidator)

    await User.create({
      // Request Validator Payload
      ...payload,

      // Conditional update of user avatar
      avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null,
    }).then((user) => {
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

    const payload = await request.validate(UpdateValidator)

    await user.merge({
      // Request Validator Payload
      ...payload,

      // Conditional update of user avatar
      avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : user.avatar,
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
