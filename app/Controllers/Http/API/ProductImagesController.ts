import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from "@ioc:Adonis/Core/Validator"
import ProductImages from 'App/Models/Pivot/ProductImage'
export default class ProductImagesController {
    public async index({ response }: HttpContextContract) {
        try {
    
          const productimages = await ProductImages.all()
          response.status(200).json(productimages)
    
        } catch (error) {
          response.badRequest(error.messages)
        }
      }
    
      public async create({}: HttpContextContract) {}
    
      public async store({ request, response }: HttpContextContract) {
        try {
    
          const validate = await request.validate({ 
            schema: schema.create({
                product_id: schema.number.optional(),
                image_path: schema.string({ trim: true }, [rules.maxLength(255)]),
              
            })
          })
          
          const productimage = await ProductImages.create(validate)
    
          response.status(200).json(productimage)
    
          //response.status(200).json(product)
    
        } catch (error) {
    
          response.badRequest(error.messages)
    
        }
    
        
    
      }
    
      public async show({}: HttpContextContract) {}
    
      public async edit({}: HttpContextContract) {}
    
      public async update({}: HttpContextContract) {}
    
      public async destroy({}: HttpContextContract) {}
}
