import {User} from "App/Models";
import {Attachment} from "@ioc:Adonis/Addons/AttachmentLite";
import ExceptionResponse from "App/Helpers/ExceptionResponse";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import UserCreateValidator from "App/Validators/User/CreateValidator";

export default class RegisterController {
  /**
   * Register users.
   *
   * @param param0 {HttpContextContract}
   * @param {JSON}
   */
  public async handle ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(UserCreateValidator)

      const avatar = payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null

      const user = await User.create({ ...payload, avatar })

      response.status(200).json(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
