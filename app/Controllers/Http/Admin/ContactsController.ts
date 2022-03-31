import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contacts from 'App/Models/Contacts'
export default class ContactsController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let contacts = await Contacts.query().paginate(request.input('page', 1), 2)

    contacts.baseUrl(request.url())

    return view.render('admin/contacts/index', { contacts })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const contact = await Contacts.findOrFail(id)
    return view.render('admin/contacts/show', { contact })
  }
}
