import Media from 'App/Models/Media'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Media/CreateValidator'
import UpdateValidator from 'App/Validators/Media/UpdateValidator'
export default class MediaController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let media = await Media.query().paginate(request.input('page', 1), 10)

    media.baseUrl(request.url())

    return view.render('admin/media/index', { media })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/media/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    const media = await Media.create({
      ...data,
      attachment: Attachment.fromFile(request.file('attachment')!),
    })
      .then((media) => {
        session.flash('media_created', media.id)
        return media
      })

    response.redirect().toRoute('media.show', { id: media.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const media = await Media.findOrFail(id)

    return view.render('admin/media/show', { media })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const media = await Media.findOrFail(params.id)

    return view.render('admin/media/edit', { media })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const media = await Media.findOrFail(params.id)

    const payload = await request.validate(UpdateValidator)

    await media.merge({
      ...payload,

      attachment: payload.attachment ? Attachment.fromFile(request.file('attachment')!) : media.attachment,
    }).save().then(() => session.flash('media_updated', true))

    response.redirect().toRoute('media.show', { id: media.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const media = await Media.findOrFail(id)

    await media.delete().then(() => {
      session.flash('media_deleted', true)

      response.redirect().toRoute('media.index')
    })
  }
}
