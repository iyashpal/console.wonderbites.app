// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import Review from 'App/Models/Review'
import User from 'App/Models/User'
import CreateValidator from 'App/Validators/Review/CreateValidator'
import UpdateValidator from 'App/Validators/Review/UpdateValidator'
export default class ReviewController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let reviews = await Review.query().paginate(request.input('page', 1), 10)

    reviews.baseUrl(request.url())

    return view.render('admin/review/index', { reviews })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    const users = await User.all()
    const products = await Product.all()
    return view.render('admin/review/create',{users,products})
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    console.log(data)
    const review = await Review.create(data)
      .then((review) => {
        session.flash('review_created', review.id)
        return review
      })

    response.redirect().toRoute('review.show', { id: review.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const review = await Review.findOrFail(id)

    return view.render('admin/review/show', { review })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const review = await Review.findOrFail(params.id)
    const users = await User.all()
    const products = await Product.all()
    return view.render('admin/review/edit', { review ,users, products})
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const review = await Review.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)
    await review.merge(data).save().then(() => session.flash('review_updated', true))

    response.redirect().toRoute('review.show', { id: review.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const review = await Review.findOrFail(id)
    await review.delete().then(() => {
      session.flash('review_deleted', true)
      response.redirect().toRoute('review.index')
    })
  }
}
