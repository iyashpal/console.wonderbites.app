import Address from 'App/Models/Address'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddressesController {
  /**
   * List all addresses of a loggedin user.
   * 
   * @param param0 HttpContextContract
   * @return {JSON}
   */
  public async index ({ auth, response }: HttpContextContract) {
    const user = auth.use('api').user!

    await user.load('addresses')

    response.status(200).json(user.addresses)
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

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

          status: schema.number.optional(),
        }),
      })

      const address = await Address.create({ userId: user.id, ...validated })

      // Check if the address is default for logged in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      // Send response
      response.status(200).json(address)
    } catch (error) {
      response.badRequest(error.message)
    }
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   */
  public async show ({ response, params }: HttpContextContract) {
    try {
      const address = await Address.findOrFail(params.id)

      await address.load('user')

      response.status(200).json(address)
    } catch (error) {
      response.notFound({ message: 'Page Not Found' })
    }
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ auth, response, params, request }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const address = await Address.findOrFail(params.id)

      try {
        const validated = await request.validate({

          schema: schema.create({

            first_name: schema.string.optional({ trim: true }, [
              rules.maxLength(255),
            ]),

            last_name: schema.string.optional({ trim: true }, [
              rules.maxLength(255),
            ]),

            street: schema.string.optional({ trim: true }, [
              rules.maxLength(255),
            ]),

            city: schema.string.optional({ trim: true }, [
              rules.maxLength(255),
            ]),

            phone: schema.string.optional({ trim: true }),

            type: schema.string.optional(),

            status: schema.number.optional()

          }),
        })

        await address.merge(validated).save()

        // Check if the address is default for logged in user.
        if (request.all()?.is_default === true) {
          await user.merge({ addressId: address.id }).save()
        }

        response.status(200).json(address)
      } catch (error) {
        response.badRequest(error)
      }
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ auth, response, params }: HttpContextContract) {
    await auth.use('api').user!

    const address = await Address.findOrFail(params.id)

    await address.delete().then(() => {
      response.status(200).json({ deleted: true })
    }).catch(error => {
      response.badRequest(error)
    })
  }
}
