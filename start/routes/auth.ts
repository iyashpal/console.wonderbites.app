import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {


    /*************************************************************************************
     * User register Routes.
     *************************************************************************************/
    Route.get('/register', 'RegistersController.show').as('register')
    Route.post('/register', 'RegistersController.register')

    /************************************************************************************
     * User login Routes.
     ************************************************************************************/
    Route.get('/login', 'LoginController.show').as('login').middleware('guest');
    Route.post('/login', 'LoginController.login').middleware('guest')

}).middleware('guest')



Route.group(() => {

    Route.post('/logout', 'LoginController.logout').as('logout')

}).middleware('auth')
