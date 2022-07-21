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

  Route.get('/forgot-password', 'Auth/PasswordResetLinkController.create').as('password.request')
  Route.post('/forgot-password', 'Auth/PasswordResetLinkController.store').as('password.email')
  Route.get('/reset-password/:email', 'Auth/').as('password.reset')

  Route.get('/verify/:email', async ({ request }) => {
    if (request.hasValidSignature()) {
      return 'Marking email as verified'
    }

    return 'Signature is missing or URL was tampered.'
  }).as('verifyEmail')
}).middleware('guest')

Route.group(() => {
  Route.post('/logout', 'Auth/LoginController.logout').as('logout')
}).middleware('auth')
