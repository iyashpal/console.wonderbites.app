import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /*************************************************************************************
   * User register Routes.
   *************************************************************************************/
  Route.get('/register', 'Auth/RegistersController.show').as('register')
  Route.post('/register', 'Auth/RegistersController.register')

  /************************************************************************************
   * User login Routes.
   ************************************************************************************/
  Route.get('/login', 'Auth/LoginController.show').as('login')
  Route.post('/login', 'Auth/LoginController.login')

  Route.get('/forgot-password', 'Auth/PasswordResetLinksController.create').as('password.request')
}).middleware('guest')

Route.group(() => {
  Route.post('/logout', 'Auth/LoginController.logout').as('logout')
}).middleware('auth')
