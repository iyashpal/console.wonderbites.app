import Contacts from 'App/Models/Contacts'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactsValidator from 'App/Validators/ContactsValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
export default class ContactsController {
  /**
   * Register users.
   * 
   * @param param0 {HttpContextContract} 
   * @param {JSON}
   */
  public async send ({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(ContactsValidator)
      console.log(request)
      const contact = await Contacts.create(data)
      await Mail.send((message) => {
        message
          .from('testingtester709@gmail.com')
          .to('neeraj@brandsonify.com')
          .subject('Contact user')
          .htmlView('emails/contact', {contact})
      })
      response.status(200).json({statusCode: 200,msg: 'Email sent successfully',data:contact})
    } catch (error) {
      response.badRequest({error :error.messages,statusCode: 400})
    }
  }
}
