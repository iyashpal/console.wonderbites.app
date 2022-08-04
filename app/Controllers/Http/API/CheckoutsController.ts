import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckoutsController {
  public async process ({ response, request }: HttpContextContract) {
    console.log(request)
    response.json({ hello: 'World!' })
  }
}
