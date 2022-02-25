// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Cart from 'App/Models/Cart'
//import ProductImages from 'App/Models/ProductImage'
export default class CartsController {
    public async index({response }: HttpContextContract) {
        try {
          
         // const id = request.input('id');
          const cart = await Cart.all()
          response.status(200).json(cart)
    
        } catch (error) {
          response.badRequest(error.messages)
        }
      }
    
      public async create({
         
      }: HttpContextContract) {}
    
      public async store({ request, response }: HttpContextContract) {
        try {
           
          const validate = await request.validate({
    
            schema: schema.create({
              //name: schema.string({ trim: true }, [rules.maxLength(255)]),
              product_id: schema.number.optional(),
              price: schema.string({ trim: true }, [rules.maxLength(20)]),
              qty: schema.number.optional(),
              status: schema.number.optional()
    
            })
          })
          
          const cart = await Cart.create(validate)
    
          response.status(200).json(cart)
    
          //response.status(200).json(product)
    
        } catch (error) {
    
          response.badRequest(error.messages)
    
        }
    
        
    
      }
    
      public async show({}: HttpContextContract) {
       
      }
    
      public async edit({}: HttpContextContract) {}
    
      public async update({}: HttpContextContract) {}
    
      public async destroy({}: HttpContextContract) {}



}
