import Route from '@ioc:Adonis/Core/Route'




Route.get('/login', 'LoginController.show').as('login');
