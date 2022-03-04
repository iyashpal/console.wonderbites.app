import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/User/CreateValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'
import User from 'App/Models/User'

export default class UsersController {



  public async index({ view, request }: HttpContextContract) {

    let users = await User.query().paginate(request.input('page', 1), 2)

    users.baseUrl(request.url())

    return view.render('app/users/index', { users })
  }




  public async create({ view }: HttpContextContract) {

    return view.render('app/users/create')
  }


  public async store({ request, response, session }: HttpContextContract) {

    const { first_name, last_name, email, password, image_path, address_id, remember_me_token, mobile } = await request.validate(CreateValidator)

    if (image_path) await image_path.moveToDisk('./')

    const user = await User.create({ first_name, last_name, email, password, image_path: image_path!.fileName, address_id, rememberMeToken: remember_me_token, mobile });

    if (user.id) {
      session.flash('user_created', true)
    }

    response.redirect().toRoute('users.show', { id: user.id })
  }



  public async show({ view, params: { id } }: HttpContextContract) {

    const user = await User.findOrFail(id)

    return view.render('app/users/show', { user })
  }



  public async edit({ view, params }: HttpContextContract) {

    const user = await User.findOrFail(params.id)

    return view.render('app/users/edit', { user })
  }



  public async update({ request, response, params, session }: HttpContextContract) {

    const user = await User.findOrFail(params.id)

    const { first_name, last_name, email, mobile, image_path, status } = await request.validate(UpdateValidator)

    if (image_path) await image_path.moveToDisk('./')


    await user.merge({ first_name, last_name, email, mobile, image_path: image_path ? image_path.fileName : user.image_path, status }).save().then(() => {
      session.flash('user_updated', true)
    })

    response.redirect().toRoute('users.show', { id: user.id })
  }



  public async destroy({ params: { id }, response, session }: HttpContextContract) {

    const user = await User.findOrFail(id)

    user.status = 0
    await user.save()
    session.flash('user_deleted', true)
    response.redirect().toRoute('users.index')
  }
}
