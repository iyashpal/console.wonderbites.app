import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'
//import { schema } from '@ioc:Adonis/Core/Validator'
//import Application from '@ioc:Adonis/Core/Application'
export default class UsersController {

    public async show({ auth, response }: HttpContextContract) {

        try {
            
            await auth.use('api').authenticate()

            const user = auth.use('api').user!


            await user.load('addresses')

            response.status(200).json(auth.use('api').user!);

        } catch (error) {

            response.unauthorized({message: "Unauthenticated"})

        }

    }
    // Update Profile
    public async update({auth, request, response}: HttpContextContract) {
        try {
            
            await auth.use('api').authenticate()

            const user = auth.use('api').user

            const user_id = user['id'];
            
            const profileImage = request.file('image_path')
            //const coverImage = request.file('image_path')
            
            await profileImage.moveToDisk('./')
            const update_data = await User.query().where('id', user_id).update({first_name : request.input('first_name'),last_name : request.input('last_name'),image_path: profileImage!.fileName})
           
           const user_details = await User.find(user_id)
           
           response.status(200).json(user_details);
            
        } catch (error) {

            response.unauthorized({message: "Unauthenticated"})

        }

    }

}
