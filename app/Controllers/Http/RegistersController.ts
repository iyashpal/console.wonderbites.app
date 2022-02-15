import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class RegistersController {

    public async show({ view }: HttpContextContract) {

        return await view.render('auth/register')
    }


    public async register({ request, auth, response }: HttpContextContract) {

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


        await auth.login(user);


        return response.redirect('/')

    }
}
