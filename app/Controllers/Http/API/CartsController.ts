// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Cart from 'App/Models/Cart'
import CartItem from 'App/Models/CartItem'
import Product from 'App/Models/Product'

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
      public async getcart({request,response}: HttpContextContract) {
        try {
          const device_token = request.input('device_token');
          const cart = await Cart.findBy('device_token', device_token)
          if(cart){
            const cart_id = cart['id'];
            const cart_items = await CartItem
         .query() 
         .where('cart_id', cart_id);
         const product_ids = [];
         cart_items.forEach((cartitem,index) => {
          product_ids.push(cartitem.product_id)
           
        })

        const products = await Product
         .query() 
         .whereIn('id', product_ids);
        
        const cart_data = { id: cart['id'],user_id : cart['user_id'],device_token : cart['device_token'],qty: cart['qty'],product:products,status:cart['status'], created_at: cart['created_at'], updated_at: cart['updated_at']}

        response.status(200).json(cart_data)
         
          
          } else{
            response.status(201).json('No cart found')

          }


          
        }catch (error) {
          
          response.badRequest(error.messages)
    
        }
      
      }
    
      public async edit({}: HttpContextContract) {}
    
      public async update({}: HttpContextContract) {}
    
      public async destroy({}: HttpContextContract) {}



}
