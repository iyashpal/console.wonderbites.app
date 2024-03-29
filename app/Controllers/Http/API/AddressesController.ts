import Address from 'App/Models/Address'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/API/Addresses/CreateValidator'
import UpdateValidator from 'App/Validators/API/Addresses/UpdateValidator'

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
      throw error
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

      const attributes = await request.validate(CreateValidator)

      const address = await user.related('addresses').create({...attributes, email: user.email})

      // Check if the address is default for logged-in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      // Send response
      response.status(200).json(address)
    } catch (error) {
      throw error
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
      throw error
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

      const validated = await request.validate(UpdateValidator)

      await address.merge(validated).save()

      // Check if the address is default for logged-in user.
      if (request.all()?.is_default === true) {
        await user.merge({ addressId: address.id }).save()
      }

      response.status(200).json(address)
    } catch (error) {
      throw error
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
      throw error
    }
  }
}
