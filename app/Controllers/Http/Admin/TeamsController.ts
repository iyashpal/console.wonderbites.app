import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import CreateValidator from 'App/Validators/Team/CreateValidator'
import UpdateValidator from 'App/Validators/Team/UpdateValidator'

export default class TeamsController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let teams = await Team.query().paginate(request.input('page', 1), 2)

    teams.baseUrl(request.url())

    return view.render('admin/teams/index', { teams })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/teams/create')
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
    const team = await Team.create({ ...data, image_path:data.image_path!.fileName })
      .then((team) => {
        session.flash('team_created', team.id)
        return team
      })

    response.redirect().toRoute('teams.show', { id: team.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const team = await Team.findOrFail(id)
    return view.render('admin/teams/show', { team })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const team = await Team.findOrFail(id)

    return view.render('admin/teams/edit', { team })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }
    await team.merge({ ...data, image_path: data.image_path ? data.image_path.fileName : team.image_path })
      .save().then(() => session.flash('team_created', true))

    response.redirect().toRoute('teams.show', { id: team.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)

    await team.delete().then(() => {
      session.flash('team_deleted', true)

      response.redirect().toRoute('teams.index')
    })
  }
}
