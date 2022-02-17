

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {


    Route.post('/login', 'API/LoginController.login').as('login')

    Route.post('/logout', "API/LoginController.logout").as('logout')

    Route.post('/register', 'API/RegisterController.register').as('register')

    Route.get('/user', "API/UsersController.show").as('user')

    Route.resource('addresses', 'API/AddressesController');

}).prefix('/api').as('api')
