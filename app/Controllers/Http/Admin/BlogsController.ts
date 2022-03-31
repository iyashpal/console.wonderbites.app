// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CategoryBlog from 'App/Models/CategoryBlog'
import Blog from 'App/Models/Blog'
import BlogCategories from 'App/Models/Pivot/BlogCategory'
import User from 'App/Models/User'
import CreateValidator from 'App/Validators/Blog/CreateValidator'
import UpdateValidator from 'App/Validators/Blog/UpdateValidator'
///import { isDate } from '@vue/shared'
//import { CountertopsIcon } from '@materialicons/vue/round'
export default class BlogsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let blogs = await Blog.query().paginate(request.input('page', 1), 10)

    blogs.baseUrl(request.url())

    return view.render('admin/blogs/index', { blogs })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    const categories = await CategoryBlog.all()
    const users = await User.all()
    return view.render('admin/blogs/create', { categories, users })
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }
    const blog = await Blog.create({ ...data, imagePath: data.image_path!.fileName, user_id: 1 })
      .then((blog) => {
        session.flash('blog_created', blog.id)
        return blog
      })
    if (request.input('category_id')) {
      const categories = request.input('category_id')
      for (let i in categories) {
        await BlogCategories.create({ category_id: categories[i], blog_id: blog.id })
      }
    }
    response.redirect().toRoute('blogs.show', { id: blog.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const blog = await Blog.findOrFail(id)

    return view.render('admin/blogs/show', { blog })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const blog = await Blog.findOrFail(params.id)
    const blogcategories = await BlogCategories.query().where('blog_id', blog.id)
    const categories = await CategoryBlog.all()
    const users = await User.all()
    return view.render('admin/blogs/edit', { blog, blogcategories, categories, users })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const blog = await Blog.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await blog.merge({
      ...data, imagePath: data.image_path ? data.image_path.fileName : blog.imagePath,
    }).save().then(() => session.flash('blog_updated', true))
    if (request.input('category_id')) {
      const categories = request.input('category_id')
      for (let i in categories) {
        await BlogCategories.create({ category_id: categories[i], blog_id: blog.id })
      }
    }
    response.redirect().toRoute('blogs.show', { id: blog.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const blog = await Blog.findOrFail(id)

    await blog.delete().then(() => {
      session.flash('blog_deleted', true)

      response.redirect().toRoute('blogs.index')
    })
  }
}
