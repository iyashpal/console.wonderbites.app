import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class UsersController {

    public async show({ auth, response }: HttpContextContract) {

        const user = auth.use('api').user!


        await user.load('addresses')

        response.status(200).json(auth.use('api').user!);

    }


    
    public async update({ auth, request, response }: HttpContextContract) {

        const user = auth.use('api').user!

        const user_id = user['id'];

        const profileImage = request.file('image_path')
        
        if (profileImage) {

            await profileImage.moveToDisk('./')

            await User.query().where('id', user_id).update({ first_name: request.input('first_name'), last_name: request.input('last_name'), image_path: profileImage!.fileName })

        } else {

            await User.query().where('id', user_id).update({ first_name: request.input('first_name'), last_name: request.input('last_name'), image_path: profileImage!.fileName })
            
        }

        const user_details = await User.find(user_id)

        response.status(200).json(user_details);

    }

}
