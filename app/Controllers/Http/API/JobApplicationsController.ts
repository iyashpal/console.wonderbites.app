import jobApplication from 'App/Models/JobApplications'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobApplicationValidator from 'App/Validators/JobApplicationValidator'

export default class JobApplicationsController {
  /**
   * Register users.
   * 
   * @param param0 {HttpContextContract} 
   * @param {JSON}
   */
  public async apply ({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(JobApplicationValidator)
      console.log(request)
      const application = await jobApplication.create(data)
      response.status(200).json({statusCode: 200,msg: 'Job submitted successfully',data:application})
    } catch (error) {
      response.badRequest({error :error.messages,statusCode: 400})
    }
  }
}
