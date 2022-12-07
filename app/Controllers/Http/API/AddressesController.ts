import Address from 'App/Models/Address'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateAddressValidator from 'App/Validators/Address/CreateValidator'
import UpdateAddressValidator from 'App/Validators/Address/UpdateValidator'
import JsonException from 'App/Exceptions/JsonException'

export default class AddressesController {
  /**
   * List all addresses of a logged-in user.
   *
   * @param param0 HttpContextContract
   * @return {JSON}
   */
  public async index ({ bouncer, auth, response }: HttpContextContract): Promise<void> {
    const user = auth.use('api').user!
    try {
      await bouncer.with('AddressPolicy').authorize('viewList')

      await user.load('addresses', query => query.orderBy('created_at', 'desc'))

      response.status(200).json(user.addresses)
    } catch (error) {

    }
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async store ({ auth, request, response }: HttpContextContract): Promise<void> {
    const user = auth.use('api').user!

    try {
      const attributes = await request.validate(CreateAddressValidator)

      const address = await user.related('addresses').create(attributes)

      // Check if the address is default for logged-in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      // Send response
      response.status(200).json(address)
    } catch (error) {
      // console.log(error.messages)
      response.unprocessableEntity(error)
    }
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ response, params }: HttpContextContract): Promise<void> {
    try {
      const address = await Address.findOrFail(params.id)

      await address.load('user')

      response.status(200).json(address.toObject())
    } catch (error) {
      response.notFound({ message: 'Page not found' })
    }
  }

  /**
   * Update the specified resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async update ({ auth, response, params, request }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      const address = await Address.findOrFail(params.id)

      try {
        const validated = await request.validate(UpdateAddressValidator)

        await address.merge(validated).save()

        // Check if the address is default for logged-in user.
        if (request.all()?.is_default === true) {
          await user.merge({ addressId: address.id }).save()
        }

        response.status(200).json(address)
      } catch (error) {
        response.badRequest(error)
      }
    } catch (error) {
      response.notFound({ message: 'Page not found' })
    }
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param param0 HttpContextContract
   */
  public async destroy ({ bouncer, response, params }: HttpContextContract): Promise<void> {
    try {
      const address = await Address.findOrFail(params.id)

      await bouncer.with('AddressPolicy').authorize('delete', address)

      await address.delete().then(() => {
        response.status(200).json({ deleted: true })
      }).catch(error => {
        response.badRequest(error)
      })
    } catch (error) {
      throw new JsonException(error.message, error.status, error.name)
    }
  }
}
