import Address from 'App/Models/Address'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateAddressValidator from 'App/Validators/Address/CreateValidator'
import UpdateAddressValidator from 'App/Validators/Address/UpdateValidator'

export default class AddressesController {
  /**
   * List all addresses of a logged-in user.
   *
   * @param param0 HttpContextContract
   * @return {JSON}
   */
  public async index ({ bouncer, auth, response }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      await bouncer.forUser(user).with('AddressPolicy').authorize('viewList')

      const addresses = await Address.query().where('user_id', user.id).orderBy('created_at', 'desc')

      response.status(200).json(addresses)
    } catch (error) {
      (new ExceptionResponse(response, error)).resolve()
    }
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async store ({ auth, request, response }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      const attributes = await request.validate(CreateAddressValidator)

      const address = await user.related('addresses').create({...attributes, email: user.email})

      // Check if the address is default for logged-in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      // Send response
      response.status(200).json(address)
    } catch (error) {
      (new ExceptionResponse(response, error)).resolve()
    }
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ auth, bouncer, request, response, params }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      const address = await Address.query()
        .match([request.input('with', []).includes('address.user'), query => query.preload('user')])
        .where('id', params.id).firstOrFail()

      await bouncer.forUser(user).with('AddressPolicy').authorize('view', address)

      response.status(200).json(address)
    } catch (error) {
      (new ExceptionResponse(response, error)).resolve()
    }
  }

  /**
   * Update the specified resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async update ({ auth, bouncer, response, params, request }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      const address = await Address.findOrFail(params.id)

      await bouncer.forUser(user).with('AddressPolicy').authorize('update', address)

      const validated = await request.validate(UpdateAddressValidator)

      await address.merge(validated).save()

      // Check if the address is default for logged-in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      response.status(200).json(address)
    } catch (error) {
      (new ExceptionResponse(response, error)).resolve()
    }
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param param0 HttpContextContract
   */
  public async destroy ({ auth, bouncer, response, params }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('api').user!

      const address = await Address.findOrFail(params.id)

      await bouncer.forUser(user).with('AddressPolicy').authorize('delete', address)

      await address.delete()

      response.status(200).json({ deleted: true })
    } catch (error) {
      (new ExceptionResponse(response, error)).resolve()
    }
  }
}
