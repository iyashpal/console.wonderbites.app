

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {


    Route.post('/login', 'API/LoginController.login').as('login')

    Route.post('/register', 'API/RegisterController.register').as('register')

    Route.get('/user', "API/UsersController.show").as('user')

    Route.resource('testimonials', 'TestimonialsController');

}).prefix('/api').as('api')
