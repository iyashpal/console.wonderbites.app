// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Blog from 'App/Models/Blog'
import Category from 'App/Models/Category'
import User from 'App/Models/User'
import CreateValidator from 'App/Validators/Blog/CreateValidator'
import UpdateValidator from 'App/Validators/Blog/UpdateValidator'
import { AirlineSeatLegroomReducedIcon } from '@materialicons/vue/round'
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
    let blogs = await Blog.query().paginate(request.input('page', 1), 2)
    let categories = await Category.query().where('type', 'Blog')
    blogs.baseUrl(request.url())

    return view.render('admin/blogs/index', { blogs,categories })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    //const categories = await Category.query().where('type', 'Blog')
    //console.log(categories)
   // const users = await User.all()
    return view.render('admin/blogs/create')
    //return view.render('admin/blogs/create', { categories, users })
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
    const name = data.name
    const slug = name.replace(/\s+/g, '-')
    const slugexist = await Blog.query().where('slug', slug)
    const slugupdate = slugexist.length === 0 ? slug : slug + (new Date()).getTime()
    const blog = await Blog.create({ ...data, image_path: data.image_path!.fileName, user_id: 1, slug: slugupdate })
      .then((blog) => {
        session.flash('blog_created', blog.id)
        return blog
      })
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
    await blog.load('categories')
    console.log(blog)
    const categories = await Category.query().where('type', 'Blog')
    return view.render('admin/blogs/show', { blog , categories})
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const blog = await Blog.findOrFail(params.id)
    const categories = await Category.query().where('type', 'Blog')
    const users = await User.all()
    return view.render('admin/blogs/edit', { blog, categories, users })
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
      ...data, image_path: data.image_path ? data.image_path.fileName : blog.image_path,
    }).save().then(() => session.flash('blog_updated', true))
    if (request.input('category_id')) {
      const categories = request.input('category_id')
      for (let i in categories) {
        await BlogCategories.create({ category_id: categories[i], blog_id: blog.id })
      }
    }
    response.redirect().toRoute('blogs.show', { id: blog.id })
  }
  public async toggleCategory ({ params: { id }, request }: HttpContextContract) {
    const blog = await Blog.findOrFail(id)

    await blog.related('categories').sync(request.input('categories'))
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
