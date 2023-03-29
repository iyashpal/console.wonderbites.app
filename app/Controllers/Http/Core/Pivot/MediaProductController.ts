import { Product, Media } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Pivot/MediaProduct/StoreValidator'

export default class MediaProductController {
  public async index ({ }: HttpContextContract) { }

  public async store ({ auth, request, params, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!
      const payload = await request.validate(StoreValidator)
      const product = await Product.query().withCount('media').where('id', params.product_id).firstOrFail()
      const media = await Media.create({
        userId: user.id, attachment: Attachment.fromFile(request.file('attachment')!),
        title: `${product.name} #${payload.order ?? (Number(product.$extras.media_count) + 1)}`,
      })

      await product.related('media').attach({ [media.id]: { order: payload.order ?? 1 } })

      response.ok(media)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
