import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Product from 'App/Models/Product'
import ProductImages from 'App/Models/ProductImage'

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    try {
      
      const products = await Product.all()
      response.status(200).json(products)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try {

      const validate = await request.validate({

        schema: schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          category_id: schema.number.optional(),
          short_description: schema.string({ trim: true }, [rules.maxLength(255)]),
          description: schema.string({ trim: true }, [rules.maxLength(255)]),
          calories: schema.string({ trim: true }, [rules.maxLength(255)]),
          price: schema.string({ trim: true }, [rules.maxLength(20)]),
          image_path: schema.string({ trim: true }, [rules.maxLength(255)]),
          status: schema.number.optional()

        })
      })
      
      const product = await Product.create(validate)

      response.status(200).json(product)

      //response.status(200).json(product)

    } catch (error) {

      response.badRequest(error.messages)

    }

    

  }

  public async show({ params, response }) {
    try {
     const { id }: { id: Number } = params;
     const product = await Product.find(id);
     
     if(product){
      //await product.load('product_images')
       const product_id = product['id'];
      //const products_images = await ProductImages.findMany({'product_id': product_id});
      // const productimages = await (await ProductImages.query().where('product_id',product_id)).filter();
      //const products_images =  await ProductImages.findBy('product_id',product_id);
       const images = await ProductImages
       .query() 
        .where('product_id', product_id);
        const productdata = {id: product['id'],category_id : product['category_id'],short_description: product['short_description'],description: product['description'],calories: product['calories'],price: product['price'],image_path: product['image_path'],product_image :images, status:product['status'],created_at:product['created_at'],updated_at: product['created_at'] }
       response.status(200).json(productdata);
     } else{
      response.status(200).json({msg:"No product found"});
     }
     
    } catch (error) {

      response.unauthorized({message: "Unauthenticated"})

  }

  }

  public async productbycategory({request, response }: HttpContextContract) {
    try {

      //const category_id = request['category_id'];
      //const products = await Product.query() .where('category_id', category_id);
      //const products = await Product.all()
      response.status(200).json(request)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
