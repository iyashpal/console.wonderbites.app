import Address from 'App/Models/Address'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AddressesController {
  public async index({ auth, response }: HttpContextContract) {

    console.log("sasd")
    try {

      await auth.use('api').authenticate()
      console.log(auth.user)
    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }

  public async create({ }: HttpContextContract) {
    console.log("asdsad333");
  }


  public async store({ auth, request, response }: HttpContextContract) {
    try {

      const user = await auth.use('api').authenticate()

      try {
        const validated = await request.validate({

          schema: schema.create({

            first_name: schema.string({ trim: true }, [
              rules.maxLength(255),
            ]),

            last_name: schema.string({ trim: true }, [
              rules.maxLength(255),
            ]),

            street: schema.string({ trim: true }, [
              rules.maxLength(255),
            ]),

            city: schema.string({ trim: true }, [
              rules.maxLength(255),
            ]),

            phone: schema.string({ trim: true }),

            type: schema.string(),

            status: schema.number.optional()

          }),
        })

        const address = await Address.create({ userId: user.id, ...validated })

        response.status(200).json(address)

      } catch (error) {

        response.badRequest(error.message)

      }
    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }


  public async show({ auth, response }: HttpContextContract) {
    try {

      await auth.use('api').authenticate()
      console.log(auth.user!)
    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }

  public async edit({ }: HttpContextContract) {
    console.log("Asdasd");

  }

  public async update({ }: HttpContextContract) {
    console.log("Asdasd111");
  }

  public async destroy({ }: HttpContextContract) {
    console.log("asdsad");
  }
}
