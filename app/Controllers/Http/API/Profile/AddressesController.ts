import Address from 'App/Models/Address'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddressesController {



  /**
   * List all addresses of a loggedin user.
   * 
   * @param param0 HttpContextContract
   * @return {JSON}
   */
  public async index({ auth, response }: HttpContextContract) {

    try {

      await auth.use('api').authenticate()

      const user = auth.use('api').user!

      await user.load('addresses')

      response.status(200).json(user.addresses)

    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
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


        // Check if the address is default for logged in user.
        if (request.all()?.is_default) {

          user.address_id = address.id;

          await user.save();

        }

        // Send response
        response.status(200).json(address)

      } catch (error) {

        response.badRequest(error.message)

      }
    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }




  public async show({ auth, response, params }: HttpContextContract) {
    try {

      await auth.use('api').authenticate()


      try {

        const address = await Address.findOrFail(params.id)

        await address.load('user')

        response.status(200).json(address)

      } catch (error) {

        response.notFound({ message: "Page Not Found" });

      }

    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }


  public async update({ auth, response, params, request }: HttpContextContract) {

    try {

      const user = await auth.use('api').authenticate();

      try {

        const address = await Address.findOrFail(params.id)

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


          await address.merge(validated).save()



          // Check if the address is default for logged in user.
          if (request.all()?.is_default) {

            user.address_id = address.id;

            await user.save();

          }

          response.status(200).json(address)

        } catch (error) {

          response.badRequest(error)

        }



      } catch (error) {
        response.badRequest(error);
      }


    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }

  }


  public async destroy({ auth, response, params }: HttpContextContract) {
    try {

      const user = await auth.use('api').authenticate()


      const address = await Address.findOrFail(params.id)


      if (user.address_id === address.id) {

        response.badRequest({ message: "Default address cannot be deleted" })

      }

      await address.delete().then(() => {

        response.status(200).json({ deleted: true })

      }).catch(error => {

        response.badRequest(error)

      })


    } catch (error) {

      response.unauthorized({ message: "Unauthenticated" })

    }
  }
}