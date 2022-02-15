import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterController {


    /**
     * Register users.
     * 
     * @param param0 {HttpContextContract} 
     * @param {JSON}
     */
    public async register({ request, response }: HttpContextContract) {

        try {

            const validated = await request.validate({

                schema: schema.create({

                    first_name: schema.string({ trim: true }),

                    last_name: schema.string({ trim: true }),

                    mobile: schema.string({ trim: true }, [
                        rules.mobile(),
                        rules.unique({ table: 'users', column: "mobile" })
                    ]),

                    email: schema.string({ trim: true }, [
                        rules.email(),
                        rules.maxLength(255),
                        rules.unique({ table: 'users', column: "email" })
                    ]),

                    password: schema.string({ trim: true }, [
                        rules.confirmed()
                    ])
                })
            })

            const user = await User.create(validated)

            response.status(200).json(user)

        } catch (error) {

            response.badRequest(error.messages)
            
        }

    }
}
