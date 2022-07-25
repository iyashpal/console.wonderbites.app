import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
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

    Route.get('/forgot-password', 'Auth/PasswordResetLinkController.create').as('password.request')
    Route.post('/forgot-password', 'Auth/PasswordResetLinkController.store').as('password.email')
    Route.post('/reset-password', 'Auth/NewPasswordController.store').as('password.update')
    Route.get('/reset-password/:token', 'Auth/NewPasswordController.create').as('password.reset')
  }).middleware('guest')

  Route.group(() => {
    Route.post('/logout', 'Auth/LoginController.logout').as('logout')
  }).middleware('auth')
})

/**
 * Auth api routes 
 */
Route.group(() => {
  /**
   * Routes that allowed only for guest users.
   */
  Route.group(() => {
    Route.post('/login', 'Auth/LoginController.login').as('login')

    Route.post('/register', 'Auth/RegisterController.register').as('register')

    Route.post('/forgot-password', 'Auth/PasswordResetLinkController.store').as('password.email')
  }).middleware('api.guest')

  Route.group(() => {
    Route.post('/logout', 'Auth/LoginController.logout').as('logout')
  }).middleware('api.auth')
}).prefix('/api').as('api')
