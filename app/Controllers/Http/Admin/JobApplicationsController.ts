import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobApplication from 'App/Models/JobApplications'
export default class JobApplicationsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let jobapplications = await JobApplication.query().paginate(request.input('page', 1), 2)
    jobapplications.baseUrl(request.url())
    return view.render('admin/jobapplications/index', { jobapplications })
  }

  public async show ({ view, params: { id } }: HttpContextContract) {
    const jobapplication = await JobApplication.findOrFail(id)
    return view.render('admin/jobapplications/show', {jobapplication})
  }
}
