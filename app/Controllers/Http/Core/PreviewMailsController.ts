import { User } from 'App/Models'
import UserOnBoard from 'App/Mailers/UserOnBoard'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PreviewMailsController {
  public async handle ({ response }: HttpContextContract) {
    const user = await User.findOrFail(1)
    const mail = await new UserOnBoard(user).preview()
    response.ok({ payload: {user}, mail})
  }
}
