import Category from 'App/Models/Category'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const category = await Category.all()

      response.status(200).json(category)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response }: HttpContextContract) {
    try {
      const validate = await request.validate({

        schema: schema.create({

          parent: schema.number.optional(),

          name: schema.string({ trim: true }, [rules.maxLength(255)]),

          description: schema.string({ trim: true }, [rules.maxLength(255)]),

          image_path: schema.string({ trim: true }, [rules.maxLength(255)]),

          status: schema.number.optional(),

        }),
      })

      const category = await Category.create(validate)

      response.status(200).json(category)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   */
  public async show ({ response, params: { id } }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(id)

      await category.load('products', async (builder) => {
        await builder.preload('media', media => {
          media.select('*')
        })
      })

      // const category = await Category.query()
      //   .preload('products', async (builder) => {
      //     await builder.preload('media')
      //   })
      //   .where('id', id)
      //   .firstOrFail()

      response.status(200).json(category)
    } catch (error) {
      response.notFound({ message: 'Category Not Found' })
    }
  }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
